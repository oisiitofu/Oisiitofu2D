'use strict';
// This file is also copied into the Sites source repository. All large inputs
// are identified by SHA-256; no image/audio re-encoding occurs in this build.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function build(site,assetRoot){
 const output=path.join(site,'payload'),inventory=JSON.parse(fs.readFileSync(path.join(site,'asset-inputs.json'),'utf8'));
 fs.mkdirSync(output,{recursive:true});
 fs.cpSync(path.join(site,'app'),output,{recursive:true});
 let bytes=0;
 for(const item of inventory.files){
  const data=fs.readFileSync(path.join(assetRoot,item.source));
  if(hash(data)!==item.sha256)throw Error('Asset changed; export again: '+item.source);
  const target=path.join(output,item.target);fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,item.range?data.subarray(...item.range):data);bytes+=item.range?item.range[1]-item.range[0]:data.length;
 }
 console.log(JSON.stringify({files:inventory.files.length,bytes,characters:inventory.characters,onlineUrl:inventory.onlineUrl}));
}
if(require.main===module){const site=__dirname,assetRoot=process.argv[2];if(!assetRoot)throw Error('Usage: node build.cjs <original game asset root>');build(site,path.resolve(assetRoot));}
module.exports={build,hash};
