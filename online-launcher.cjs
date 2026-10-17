'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawn,execFileSync}=require('node:child_process');
const root=__dirname,dir=path.join(root,'.tools'),stateFile=path.join(dir,'online-launcher-state.json'),lockFile=path.join(dir,'online-launcher.lock'),stopFile=path.join(dir,'online-launcher.stop');
const read=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));}catch{return null;}},sleep=ms=>new Promise(r=>setTimeout(r,ms));
const alive=pid=>{const id=Number(pid);if(!Number.isSafeInteger(id)||id<=0)return false;try{process.kill(id,0);return true;}catch{return false;}};
const tunnelUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'&&/^[a-z0-9-]+\.trycloudflare\.com$/.test(u.hostname)&&u.pathname==='/'&&!u.port&&!u.username&&!u.password&&!u.search&&!u.hash?u.origin:null;}catch{return null;}};
function save(file,data){const temp=file+'.tmp';fs.writeFileSync(temp,JSON.stringify(data,null,2));fs.renameSync(temp,file);}
function processes(pid){
 if(process.platform!=='win32')return[];
 const filter=pid?'ProcessId='+Number(pid):"Name='cloudflared.exe'";
 try{const raw=execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); @(Get-CimInstance Win32_Process -Filter "${filter}" | Select-Object ProcessId,ExecutablePath,CommandLine) | ConvertTo-Json -Compress`],{windowsHide:true,encoding:'utf8',timeout:10000});const p=JSON.parse(raw);return Array.isArray(p)?p:p?[p]:[];}catch{return[];}
}
const daemonProcess=state=>state&&alive(state.pid)&&processes(state.pid).some(p=>p.CommandLine?.includes(__filename)&&p.CommandLine.includes('--daemon'));
function quickProcess(p,exe,port){return p.ExecutablePath?.toLowerCase()===exe.toLowerCase()&&p.CommandLine?.includes('tunnel')&&!/--token\b/.test(p.CommandLine)&&new RegExp('--url\\s+["\']?http://(?:localhost|127\\.0\\.0\\.1):'+port+'(?:[\\s/"\']|$)').test(p.CommandLine);}
async function health(url,timeout=6000){try{const r=await fetch(url+'/health',{signal:AbortSignal.timeout(timeout),redirect:'error',cache:'no-store'});return r.ok&&(await r.json()).status==='ok';}catch{return false;}}
class TunnelSupervisor{
 constructor(io){this.io=io;this.misses=0;this.lastPublish=0;this.tunnel=null;}
 async tick(now){
  await this.io.ensureServer();
  if(!this.tunnel||!this.io.alive(this.tunnel.pid)){this.tunnel=await this.io.acquire();this.misses=0;this.lastPublish=0;}
  if(!await this.io.healthy(this.tunnel.url)){
   if(++this.misses>=3&&await this.io.internet()){await this.io.stopTunnel(this.tunnel);this.tunnel=null;this.misses=0;}
   this.io.status({phase:'reconnecting',url:this.tunnel?.url});return;
  }
  this.misses=0;if(!this.lastPublish||now-this.lastPublish>=45000){await this.io.publish(this.tunnel.url);this.lastPublish=now;}
  this.io.status({phase:'online',url:this.tunnel.url,tunnelPid:this.tunnel.pid});
 }
}
async function daemon(){
 fs.mkdirSync(dir,{recursive:true});
 const publicConfig=read(path.join(root,'public-site.json')),privateConfig=read(path.join(dir,'online-launcher-private.json'));
 if(!publicConfig?.publicUrl||!privateConfig?.token)throw Error('Launcher registration key is missing. See ONLINE.md.');
 let fd;
 try{fd=fs.openSync(lockFile,'wx');}catch(error){
  if(error.code!=='EEXIST')throw error;
  // Give a simultaneously starting daemon time to write its PID before checking.
  await sleep(1500);const previous=read(lockFile);if(previous&&daemonProcess(previous))return;
  if(fs.existsSync(lockFile)&&Date.now()-fs.statSync(lockFile).mtimeMs<10000)return;
  fs.rmSync(lockFile,{force:true});try{fd=fs.openSync(lockFile,'wx');}catch(e){if(e.code==='EEXIST')return;throw e;}
 }
 const instance=crypto.randomUUID();fs.writeFileSync(fd,JSON.stringify({pid:process.pid,instance}));fs.closeSync(fd);
 const entry=new URL('/online',publicConfig.publicUrl).href,endpoint=new URL('/api/online-route',publicConfig.publicUrl).href;
 const exe=path.join(dir,'cloudflared.exe'),port=4173,local='http://127.0.0.1:'+port;let stopping=false;
 const status=data=>save(stateFile,{...read(stateFile),pid:process.pid,instance,entry,updatedAt:Date.now(),error:null,...data});
 const log=message=>process.stdout.write(new Date().toISOString()+' '+message+'\n');status({phase:'starting'});
 const supervisor=new TunnelSupervisor({
  alive,healthy:health,
  async ensureServer(){if(await health(local,2500))return;const out=fs.openSync(path.join(dir,'online-server.log'),'a');const child=spawn(process.execPath,[path.join(root,'server.cjs')],{cwd:root,windowsHide:true,detached:true,stdio:['ignore',out,out]});child.unref();fs.closeSync(out);for(let n=0;n<20;n++){await sleep(500);if(await health(local,1000))return;}throw Error('Local game server did not start. Check .tools/online-server.log.');},
  async acquire(){
   // Reuse this workspace's healthy Quick Tunnel so launching a bat does not
   // interrupt an existing game or change its transport protocol.
   const candidates=processes().filter(p=>quickProcess(p,exe,port)),saved=read(stateFile)?.url;
   let text='';try{text=fs.readFileSync(path.join(dir,'public-url.txt'),'utf8').trim();}catch{}
   for(const url of new Set([saved,text].map(tunnelUrl).filter(Boolean)))if(candidates.length===1&&await health(url)){fs.writeFileSync(path.join(dir,'tunnel.pid'),String(candidates[0].ProcessId));log('Reusing existing tunnel.');return{pid:candidates[0].ProcessId,url};}
   if(!fs.existsSync(exe))throw Error('cloudflared.exe is missing. See ONLINE.md.');
   const logPath=path.join(dir,'online-tunnel.log'),out=fs.openSync(logPath,'w'),child=spawn(exe,['tunnel','--no-autoupdate','--url',local],{cwd:root,windowsHide:true,detached:true,stdio:['ignore',out,out]});child.unref();fs.closeSync(out);
   for(const deadline=Date.now()+90000;Date.now()<deadline;){if(!alive(child.pid))throw Error('Tunnel stopped. Check .tools/online-tunnel.log.');await sleep(500);const match=fs.readFileSync(logPath,'utf8').match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);if(match&&await health(match[0])){fs.writeFileSync(path.join(dir,'public-url.txt'),match[0]);fs.writeFileSync(path.join(dir,'tunnel.pid'),String(child.pid));log('New tunnel is ready.');return{pid:child.pid,url:match[0]};}}
   if(processes(child.pid).some(p=>quickProcess(p,exe,port)))process.kill(child.pid);throw Error('Tunnel did not become ready.');
  },
  async internet(){try{return(await fetch(new URL('/api/online-route',publicConfig.publicUrl),{signal:AbortSignal.timeout(6000)})).ok;}catch{return false;}},
  async publish(url){if(!privateConfig?.token)throw Error('Launcher registration key is missing. See ONLINE.md.');const r=await fetch(endpoint,{method:'PUT',headers:{Authorization:'Bearer '+privateConfig.token,'Content-Type':'application/json'},body:JSON.stringify({url,instance}),signal:AbortSignal.timeout(12000)});if(r.status!==204)throw Error('Fixed entry registration failed (HTTP '+r.status+').');},
  async stopTunnel(tunnel){if(processes(tunnel.pid).some(p=>quickProcess(p,exe,port)))process.kill(tunnel.pid);},status
 });
 process.on('SIGTERM',()=>stopping=true);process.on('SIGINT',()=>stopping=true);
 try{let next=0;while(!stopping){if(read(stopFile)?.instance===instance)break;const now=Date.now();if(now>=next){try{await supervisor.tick(now);}catch(error){status({phase:'retrying',error:error.message});log(error.message);}next=Date.now()+15000;}await sleep(500);}}
 finally{if(supervisor.tunnel)await supervisor.io.stopTunnel(supervisor.tunnel);if(privateConfig?.token)try{await fetch(endpoint,{method:'DELETE',headers:{Authorization:'Bearer '+privateConfig.token,'Content-Type':'application/json'},body:JSON.stringify({instance}),signal:AbortSignal.timeout(6000)});}catch{}status({phase:'stopped',url:null,tunnelPid:null});if(read(lockFile)?.instance===instance)fs.rmSync(lockFile,{force:true});if(read(stopFile)?.instance===instance)fs.rmSync(stopFile,{force:true});}
}
async function cli(command){
 fs.mkdirSync(dir,{recursive:true});let current=read(stateFile);
 if(command==='status'){console.log(JSON.stringify({...current,running:!!daemonProcess(current)}));return;}
 if(command==='stop'){
  if(daemonProcess(current)){save(stopFile,{instance:current.instance});for(let n=0;n<50&&alive(current.pid);n++)await sleep(500);if(alive(current.pid))throw Error('Stop is still pending. Retry stop-online.bat shortly.');}
  console.log('Online tunnel stopped. The local game server remains available.');return;
 }
 if(command!=='start')throw Error('Usage: node online-launcher.cjs start|stop|status');
 if(!daemonProcess(current)){const out=fs.openSync(path.join(dir,'online-launcher.log'),'a'),child=spawn(process.execPath,[__filename,'--daemon'],{cwd:root,detached:true,windowsHide:true,stdio:['ignore',out,out]});child.unref();fs.closeSync(out);}
 for(let n=0;n<160;n++){await sleep(500);current=read(stateFile);if(current?.phase==='online'&&Date.now()-current.updatedAt<20000&&alive(current.pid)){console.log('Online entry: '+current.entry);console.log('The launcher runs in the background. Use stop-online.bat to stop.');return;}}
 throw Error((current?.error||'Online launcher is still starting.')+' Check .tools/online-launcher.log.');
}
module.exports={TunnelSupervisor,tunnelUrl,quickProcess};
if(require.main===module)(process.argv[2]==='--daemon'?daemon():cli(process.argv[2]||'start')).catch(e=>{console.error(e.message);process.exitCode=1;});
