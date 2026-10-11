'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=__dirname,payload=path.join(root,'payload'),files={},objects=new Map();
function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name==='.openai')continue;const file=path.join(dir,entry.name);if(entry.isDirectory())scan(file);else if(entry.isFile()){const name=path.relative(payload,file).replaceAll('\\','/'),sha=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');files[name]=sha;objects.set(sha,{sha,file,size:fs.statSync(file).size});}}}
scan(payload);
fs.writeFileSync(path.join(root,'object-map.json'),JSON.stringify(files));
const server=path.join(root,'dist/server');fs.mkdirSync(server,{recursive:true});
fs.writeFileSync(path.join(server,'index.js'),'const FILES='+JSON.stringify(files)+';\n'+fs.readFileSync(path.join(root,'worker.mjs'),'utf8'));
fs.mkdirSync(path.join(root,'dist/.openai'),{recursive:true});fs.copyFileSync(path.join(root,'.openai/hosting.json'),path.join(root,'dist/.openai/hosting.json'));
fs.writeFileSync(path.join(root,'upload-inputs.json'),JSON.stringify([...objects.values()]));
console.log(JSON.stringify({paths:Object.keys(files).length,objects:objects.size,workerBytes:fs.statSync(path.join(server,'index.js')).size}));
