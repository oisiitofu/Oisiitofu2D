'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const {hash,build}=require('./public-build.cjs');
const root=__dirname,site=path.resolve(process.argv[2]||path.join(root,'.tools/local-public-site'));
const config=JSON.parse(fs.readFileSync(path.join(root,'public-site.json'),'utf8'));
if(!/^https:\/\//.test(config.onlineUrl))throw Error('onlineUrl must be HTTPS');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const app=path.join(site,'app');fs.mkdirSync(app,{recursive:true});
const write=(name,data)=>{const file=path.join(app,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);};
function replace(source,from,to){if(!source.includes(from))throw Error('Static adapter is outdated: '+from.slice(0,90));return source.replace(from,to);}
let html=read('index.html');
const scripts=require('./script-bundle.cjs').files(root);
if(!scripts.includes('online.js')||!scripts.includes('audio.js'))throw Error('Missing registered scripts');
let bundle='const PublicOnlineConfig='+JSON.stringify({onlineUrl:config.onlineUrl})+';\n';
for(const file of scripts){
 let code=read(file==='online.js'?'public-online.js':file);
 if(file==='audio.js'){
  code=replace(code,"'/api/audio/bgm?stage='+encodeURIComponent(currentStage)","'/assets/audio/bgm-manifests/'+encodeURIComponent(currentStage)+'.json'");
  code=replace(code,'function setTrack(){bgm.src=trackList[trackIndex].url;bgm.loop=true;bgm.load();playPending=false;retryAt=0;sync();}',`let chunkController=null,chunkUrl=null;
 async function setTrack(){
  const track=trackList[trackIndex],token=generation;
  chunkController?.abort();chunkController=new AbortController();const controller=chunkController;
  if(chunkUrl){URL.revokeObjectURL(chunkUrl);chunkUrl=null;}
  bgm.removeAttribute('src');playPending=true;
  try{
   let url=track.url;
   if(track.parts){
    const parts=await Promise.all(track.parts.map(async part=>{const response=await fetch(part,{signal:controller.signal});if(!response.ok)throw Error('BGM part '+response.status);return response.arrayBuffer();}));
    if(token!==generation||controller!==chunkController)return;
    url=chunkUrl=URL.createObjectURL(new Blob(parts,{type:track.mime}));
   }
   if(token!==generation||controller!==chunkController)return;
   bgm.src=url;bgm.loop=true;bgm.load();playPending=false;retryAt=0;sync();
  }catch(error){if(error.name!=='AbortError'&&token===generation){playPending=false;diagnostics.bgmError='BGMを読み込めませんでした';}}
 }`);
  code=replace(code,'function stop(){generation++;','function stop(){chunkController?.abort();if(chunkUrl){URL.revokeObjectURL(chunkUrl);chunkUrl=null;}generation++;');
  code=replace(code,'if(trackList.length&&bgm.paused&&!playPending','if(trackList.length&&bgm.hasAttribute(\'src\')&&bgm.paused&&!playPending');
 }
 if(file==='art-loader.js')code=replace(code,"const raw=new URLSearchParams(location.search).has('rawArt');",'const raw=false;');
 if(file==='game.js')code=replace(code,'if(!await ArtLoader.init()){await loadRaw();return;}',"if(!await ArtLoader.init()){$('#loading').textContent='キャラ画像を読み込めませんでした。ページを再読み込みしてください。';return;}");
 if(file==='roster.js')code=replace(code,"if(room&&/^[A-Fa-f0-9]{6}$/.test(room)){document.querySelector('#room-code').value=room.toUpperCase();}",'');
 bundle+='\n/* '+file+' */\n'+code+'\n';
}
new vm.Script(bundle);
write('game-bundle.js',bundle);
html=require('./script-bundle.cjs').html(Buffer.from(html));
html=html.replace(/<option value="online">[^<]*<\/option>/g,'');
write('index.html',html);
write('character-sizes.html',read('character-sizes.html'));
for(const match of html.matchAll(/href="([^"?#]+\.css)"/g))write(match[1],read(match[1]));
const manifest=JSON.parse(read('assets/ready/manifest.json'));write('assets/ready/manifest.json',JSON.stringify(manifest));
const inputs=[],seen=new Set();
function input(source,target=source,range){if(seen.has(target))return;seen.add(target);const data=fs.readFileSync(path.join(root,source));if(!range&&data.length>25*1024*1024)throw Error('Oversize asset: '+source);inputs.push({source,target,sha256:hash(data),...(range?{range}:{})});}
function images(value){if(typeof value==='string'&&/^assets\/ready\/.*\.(png|webp)$/.test(value))input(value);else if(value&&typeof value==='object')for(const entry of Object.values(value))images(entry);}
images(manifest);
for(const match of read('stage-art-data.js').matchAll(/"(assets\/ready\/[^"\n]+)"/g))input(match[1]);
input('assets/astral-sanctum.png');
input('assets/presentation/cinematic-atlas.png');
const se=JSON.parse(read('assets/audio/se/manifest.json'));write('assets/audio/se/manifest.json',JSON.stringify(se));
for(const url of Object.values(se.sounds).flat())input(decodeURIComponent(url.replace(/^\//,'')));
const audio=require('./audio-server.cjs'),chunkSize=16*1024*1024;
for(const id of [...audio.stages.map(s=>s.id),'menu','victory']){
 const data=audio.manifest(root,id);
 for(const track of data.tracks){
  const source=decodeURIComponent(track.url.slice(1)),size=fs.statSync(path.join(root,source)).size;
  if(size>25*1024*1024){
   track.mime=path.extname(source)==='.wav'?'audio/wav':'application/octet-stream';track.parts=[];
   for(let offset=0,n=0;offset<size;offset+=chunkSize,n++){
    const target=source+'.part'+n;input(source,target,[offset,Math.min(size,offset+chunkSize)]);track.parts.push('/'+target.split('/').map(encodeURIComponent).join('/'));
   }
   delete track.url;
  }else input(source);
 }
 write('assets/audio/bgm-manifests/'+id+'.json',JSON.stringify(data));
}
fs.writeFileSync(path.join(site,'asset-inputs.json'),JSON.stringify({characters:Object.keys(manifest.characters).length,onlineUrl:config.onlineUrl,upstream:'https://github.com/oisiitofu/Oisiitofu2D',revision:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),files:inputs},null,2));
fs.copyFileSync(path.join(root,'public-build.cjs'),path.join(site,'build.cjs'));
fs.copyFileSync(path.join(root,'public-worker.mjs'),path.join(site,'worker.mjs'));
fs.copyFileSync(path.join(root,'public-worker-build.cjs'),path.join(site,'worker-build.cjs'));
fs.writeFileSync(path.join(site,'.gitignore'),'dist/\npayload/\nupload-inputs.json\nnode_modules/\n');
const manifestPath=path.join(site,'.openai/hosting.json');fs.mkdirSync(path.dirname(manifestPath),{recursive:true});
const hosting=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{};
if(hosting.project_id&&hosting.project_id!==config.projectId)throw Error('Site identity mismatch');
delete hosting.static;
fs.writeFileSync(manifestPath,JSON.stringify({...hosting,project_id:config.projectId,d1:null,r2:'BUCKET'},null,2));
build(site,root);
execFileSync(process.execPath,[path.join(site,'worker-build.cjs')],{cwd:site,stdio:'inherit'});
