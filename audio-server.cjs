'use strict';
const fs=require('node:fs'),path=require('node:path');
const stages=require('./stage-data.js').stages.map(({id,name,folder})=>({id,name,folder}));
const locations=[...stages,{id:'menu',name:'タイトル・キャラ選択',folder:'menu'}];
const mime={'.wav':'audio/wav','.mp3':'audio/mpeg','.ogg':'audio/ogg','.m4a':'audio/mp4','.aac':'audio/aac','.flac':'audio/flac'};
function manifest(root,id){const stage=locations.find(s=>s.id===id);if(!stage)return null;const dir=path.join(root,'assets/audio/bgm',stage.folder);let files=[];try{files=fs.readdirSync(dir,{withFileTypes:true}).filter(f=>f.isFile()&&mime[path.extname(f.name).toLowerCase()]).map(f=>f.name).sort((a,b)=>a.localeCompare(b,'ja'));}catch{}
 const custom=files.filter(f=>f.toLowerCase()!=='_default.wav');if(custom.length)files=custom;
 return{...stage,tracks:files.slice(0,512).map(name=>({name,url:`/assets/audio/bgm/${stage.folder}/${encodeURIComponent(name)}`}))};
}
function handle(req,res,pathname,root){
 if(pathname==='/api/audio/bgm'){const id=new URL(req.url,'http://localhost').searchParams.get('stage')||'0',data=manifest(root,id);res.writeHead(data?200:400,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(data||{error:'Unknown stage'}));return true;}
 if(!pathname.startsWith('/assets/audio/'))return false;
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return true;}
 const parts=pathname.slice('/assets/audio/'.length).split('/');
 const isSE=parts.length===2&&parts[0]==='se'&&/^[a-z0-9-]+\.(wav|json)$/.test(parts[1]);
 const isBGM=parts.length===3&&parts[0]==='bgm'&&locations.some(s=>s.folder===parts[1])&&parts[2]!=='.'&&parts[2]!=='..'&&!/[\\\x00-\x1f]/.test(parts[2])&&mime[path.extname(parts[2]).toLowerCase()];
 if(!isSE&&!isBGM){res.writeHead(404).end();return true;}
 const base=path.join(root,'assets/audio'),file=path.resolve(base,...parts);if(!file.startsWith(base+path.sep)){res.writeHead(404).end();return true;}
 let stat;try{stat=fs.lstatSync(file);if(!stat.isFile()||!fs.realpathSync(file).startsWith(fs.realpathSync(base)+path.sep))throw Error();}catch{res.writeHead(404).end();return true;}
 const headers={'Content-Type':mime[path.extname(file).toLowerCase()]||'application/json; charset=utf-8','Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
 let start=0,end=stat.size-1,status=200;if(req.headers.range){const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!m||!m[1]&&!m[2]){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return true;}if(m[1]){start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),end):end;}else start=Math.max(0,stat.size-Number(m[2]));if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return true;}status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;}
 headers['Content-Length']=Math.max(0,end-start+1);res.writeHead(status,headers);if(req.method==='HEAD'||!stat.size){res.end();return true;}const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);return true;
}
module.exports={handle,manifest,stages};
