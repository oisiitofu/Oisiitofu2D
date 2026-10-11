'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
(async()=>{
 const data=Buffer.from('browser local game'),sha=crypto.createHash('sha256').update(data).digest('hex'),objects=new Map(),cached=new Map(),pending=[];
 const source='const FILES='+JSON.stringify({'index.html':sha,'sample.wav':sha})+';\n'+fs.readFileSync('public-worker.mjs','utf8');
 const worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
 globalThis.caches={default:{match:async req=>cached.get(req.url)?.clone(),put:async(req,res)=>{cached.set(req.url,res);}}};
 const env={ASSET_UPLOAD_TOKEN:'test-secret',BUCKET:{
  head:async key=>objects.has(key)?{size:objects.get(key).length,range:{offset:0,length:objects.get(key).length}}:null,
  put:async(key,body,options)=>{const bytes=Buffer.from(await new Response(body).arrayBuffer());assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),options.sha256);objects.set(key,bytes);},
  get:async(key,options)=>{const bytes=objects.get(key);if(!bytes)return null;const range=/bytes=(\d+)-(\d+)/.exec(options?.range.get('Range')||'');return{size:bytes.length,body:range?bytes.subarray(+range[1],+range[2]+1):bytes,range:range?{offset:+range[1],length:+range[2]-range[1]+1}:{offset:0,length:bytes.length}};}
 }},ctx={waitUntil:p=>pending.push(p)};
 const fetch=(name,options={})=>worker.fetch(new Request('https://local.test'+name,options),env,ctx);
 assert.equal((await fetch('/')).status,503);
 assert.equal((await fetch('/_asset-upload/'+sha,{method:'PUT',body:data})).status,404);
 const auth={Authorization:'Bearer test-secret'};
 assert.equal((await fetch('/_asset-upload/unknown',{method:'PUT',headers:auth,body:data})).status,400);
 assert.equal((await fetch('/_asset-upload/'+sha,{method:'PUT',headers:auth,body:data})).status,204);
 const response=await fetch('/');assert.equal(response.status,200);assert.equal(await response.text(),data.toString());await Promise.all(pending);
 assert.equal((await fetch('/',{headers:{'If-None-Match':'"'+sha+'"'}})).status,304);
 const head=await fetch('/sample.wav',{method:'HEAD'});assert.equal(head.status,200);assert.equal(head.headers.get('Content-Length'),String(data.length));assert.equal(await head.text(),'');
 const range=await fetch('/sample.wav',{headers:{Range:'bytes=2-5'}});assert.equal(range.status,206);assert.equal(range.headers.get('Content-Range'),'bytes 2-5/'+data.length);assert.equal(await range.text(),data.subarray(2,6).toString());
 Object.defineProperty(globalThis.caches,'default',{get(){throw Error('Cache API unavailable');}});assert.equal((await fetch('/')).status,200);
 delete env.ASSET_UPLOAD_TOKEN;assert.equal((await fetch('/_asset-upload/'+sha,{method:'PUT',headers:auth,body:data})).status,404);
 assert.equal((await fetch('/missing')).status,404);
 console.log('Worker: checked upload authorization/checksum, immutable data, HEAD/ranges, cache/ETag and disabled upload route');
})().catch(error=>{console.error(error);process.exitCode=1;});
