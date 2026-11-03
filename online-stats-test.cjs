'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),os=require('node:os'),path=require('node:path'),fs=require('node:fs/promises');
const {WebSocket}=require('ws'),{attachOnline}=require('./online-server.cjs'),{createOnlineStats}=require('./online-stats.cjs');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(check){
 for(let n=0;n<100;n++){const result=await check();if(result)return result;await delay(20);}
 throw Error('Timed out waiting for match or statistics');
}
async function connect(url){
 const ws=new WebSocket(url),messages=[];
 ws.on('message',raw=>{const message=JSON.parse(raw);if(message.type!=='frame')messages.push(message);});
 await new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject);});
 return {ws,send:m=>ws.send(JSON.stringify(m)),get:(type,test=()=>true)=>until(()=>messages.find(m=>m.type===type&&test(m)))};
}
(async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'tofu-stats-')),file=path.join(dir,'stats.json'),stats=createOnlineStats(file);
 const server=http.createServer((req,res)=>stats.serve(req,res,req.url)||res.writeHead(404).end());
 attachOnline(server,{stats});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const host='127.0.0.1:'+server.address().port,clients=[];
 const read=()=>fetch('http://'+host+'/api/online-stats').then(r=>r.json());
 try{
  for(let n=0;n<2;n++)clients.push(await connect('ws://'+host+'/online'));
  const [a,b]=clients;
  a.send({type:'create',name:'Alice',squadSize:3});const {code}=await a.get('joined');
  b.send({type:'join',code,name:'Bob'});await b.get('joined');
  async function begin(id){
   a.send({type:'ready',character:'dragoon',team:['dragoon','tifa','tails'],stage:'0'});
   b.send({type:'ready',character:'vivi',team:['vivi','clive','quote'],stage:'0'});
   await Promise.all(clients.map(c=>c.get('prepare',m=>m.config.matchId===id)));
   clients.forEach(c=>c.send({type:'loaded',matchId:id}));
   await Promise.all(clients.map(c=>c.get('start',m=>m.config.matchId===id)));
  }
  await begin(1);
  a.send({type:'finished',matchId:1,winner:0,played:[1,2]});
  b.send({type:'finished',matchId:1,winner:1,played:[1,2]});
  await a.get('room',m=>m.matchId===1&&!m.playing&&!m.preparing);
  assert.equal((await read()).matches,0,'disagreed results are excluded');
  await begin(2);
  a.send({type:'finished',matchId:2,winner:0,played:[1,2]});
  a.send({type:'finished',matchId:2,winner:0,played:[1,2]});
  b.send({type:'finished',matchId:1,winner:0,played:[1,2]});
  assert.equal((await read()).matches,0,'duplicate and old reports cannot settle the match');
  b.send({type:'finished',matchId:2,winner:0,played:[1,2]});
  const first=await until(async()=>{const v=await read();return v.matches===1&&v;});
  assert.deepEqual(first.players.map(p=>[p.name,p.matches,p.wins]),[['Alice',1,1],['Bob',1,0]]);
  assert.deepEqual(first.characters.map(c=>[c.id,c.uses,c.wins]),[['dragoon',1,1],['vivi',1,0],['clive',1,0]]);
  await begin(3);
  clients.forEach(c=>c.send({type:'finished',matchId:3,winner:-1,played:[1,1]}));
  const result=await until(async()=>{const v=await read();return v.matches===2&&v;});
  assert.deepEqual(result.players.map(p=>[p.name,p.matches,p.wins,p.draws]),[['Alice',2,1,1],['Bob',2,0,1]]);
  assert.ok(!result.characters.some(c=>['tifa','tails','quote'].includes(c.id)),'bench characters are excluded');
  const reloaded=createOnlineStats(file),response={writeHead(){return this;},end(raw){this.data=JSON.parse(raw);}};
  reloaded.serve({method:'GET'},response,'/api/online-stats');
  assert.deepEqual(response.data,result,'statistics persist across store restart');
  assert.equal((await fetch('http://'+host+'/api/online-stats',{method:'PUT'})).status,405);
  const {onlineStats}=await import('./public-worker.mjs');
  let snapshot=null;
  const env={ONLINE_ROUTE_TOKEN:'test-only',BUCKET:{get:async()=>snapshot,head:async()=>snapshot,put:async(key,raw,meta)=>{snapshot={body:raw,...meta};}}};
  const req=(method,body,token)=>new Request('https://example.test/api/online-stats',{method,body,headers:token?{Authorization:'Bearer '+token}:{}});
  assert.equal((await onlineStats(req('PUT',JSON.stringify(result)),env)).status,401);
  assert.equal((await onlineStats(req('PUT',JSON.stringify(result),'test-only'),env)).status,204);
  assert.deepEqual(await (await onlineStats(req('GET'),env)).json(),result,'public snapshot is readable independently of the host');
  console.log('Online statistics agreement, deduplication, actual lineup use, persistence and snapshot passed');
 }finally{
  clients.forEach(c=>c.ws.terminate());
  await new Promise(resolve=>server.close(resolve));
  await fs.unlink(file).catch(error=>{if(error.code!=='ENOENT')throw error;});
  await fs.rmdir(dir);
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
