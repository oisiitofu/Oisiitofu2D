'use strict';
// Keep index.html as the script-order source of truth for new fighters.
// Bundle on the server to avoid dozens of serial requests over a shared URL.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto');
const pattern=()=>/<script (?:defer )?src="((?:characters\/[a-z0-9-]+\/)?[a-z0-9-]+\.js)"><\/script>/g;
const files=root=>[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(pattern())].map(m=>m[1]);
let cached=null;
function html(data){let first=true;return data.toString('utf8').replace(pattern(),()=>{if(!first)return'';first=false;return'<script defer src="game-bundle.js"></script>';});}
function bundle(root){
 const scripts=files(root);
 if(!scripts.length)throw Error('No game scripts registered');
 const signature=scripts.map(file=>{const stat=fs.statSync(path.join(root,file));return file+':'+stat.size+':'+stat.mtimeMs;}).join('|');
 if(cached?.signature===signature)return cached;
 const source=Buffer.from(scripts.map(file=>'\n/* '+file+' */\n'+fs.readFileSync(path.join(root,file),'utf8')+'\n').join(''));
 const etag='"'+crypto.createHash('sha256').update(source).digest('hex')+'"';
 cached={signature,source,gzip:zlib.gzipSync(source),etag};return cached;
}
function serve(req,res,pathname,root){
 if(pathname!=='/game-bundle.js')return false;
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return true;}
 try{
  const data=bundle(root),headers={'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache',ETag:data.etag,Vary:'Accept-Encoding','X-Content-Type-Options':'nosniff'};
  if(req.headers['if-none-match']===data.etag){res.writeHead(304,headers).end();return true;}
  const gzip=/\bgzip\b/.test(req.headers['accept-encoding']||''),bytes=gzip?data.gzip:data.source;
  if(gzip)headers['Content-Encoding']='gzip';headers['Content-Length']=bytes.length;
  res.writeHead(200,headers).end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(500).end('Game scripts unavailable');}
 return true;
}
module.exports={html,serve,files};
