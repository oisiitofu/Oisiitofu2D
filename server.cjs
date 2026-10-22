const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,port=Number(process.env.PORT||4173),host=process.env.HOST||'0.0.0.0',types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json; charset=utf-8'};
const server=http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 if(require('./script-bundle.cjs').serve(req,res,pathname,root))return;
 if(require('./audio-server.cjs').handle(req,res,pathname,root))return;
 if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'}).end('{"status":"ok"}');return;}
 const publicFiles=new Set(["/","/index.html","/character-sizes.html","/style.css","/assets/presentation/cinematic-atlas.png",...require("./script-bundle.cjs").files(root).map(file=>"/"+file)]);
 const readyAsset=/^\/assets\/ready\/[a-z0-9_-]+-[a-f0-9]{16}\.(png|webp)$/.test(pathname);
 const characterAsset=/^\/characters\/[a-z0-9-]+\/assets\/[a-zA-Z0-9_-]+\.(png|svg|webp)$/.test(pathname);
 if(pathname!=="/assets/ready/manifest.json"&&!readyAsset&&!characterAsset&&!publicFiles.has(pathname)&&!/^\/assets\/[a-zA-Z0-9_-]+\.(png|svg)$/.test(pathname)){res.writeHead(404).end();return;}
 let file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||!types[path.extname(file)]||pathname.includes('/node_modules/')||pathname.includes('/.')){res.writeHead(404).end();return;}
 fs.readFile(file,(e,data)=>{if(e){res.writeHead(404).end('Not found');return;}if(path.extname(file)==='.html')data=require('./script-bundle.cjs').html(data);res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':readyAsset?'public, max-age=31536000, immutable':'no-cache','X-Content-Type-Options':'nosniff'});res.end(data);});
});
require('./online-server.cjs').attachOnline(server);
server.listen(port,host,()=>console.log(`おいしいとうふブラザーズ http://localhost:${port}`));

