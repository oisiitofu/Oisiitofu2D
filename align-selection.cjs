'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),{align}=require('./selection-framing.cjs');
const sourceFile='.tools/selection-portrait-sources.json',sources=JSON.parse(fs.readFileSync(sourceFile)),policy=JSON.parse(fs.readFileSync('selection-framing-guides.json'));
const ids=process.env.ART_IDS?.split(',').filter(Boolean)||Object.keys(policy.characters),manifest=JSON.parse(fs.readFileSync('assets/ready/manifest.json')),changes=[];
const baselineIndex=process.argv.indexOf('--baseline'),baseline=baselineIndex<0?null:JSON.parse(fs.readFileSync(process.argv[baselineIndex+1]));
for(const id of ids){const guide=policy.characters[id],source=sources[id];if(!guide||!source?.crop)throw Error('Missing source/face guide: '+id);if(guide.source&&guide.source!==source.source)throw Error('Re-review the replaced source: '+id);if(guide.sourceSha256&&crypto.createHash('sha256').update(fs.readFileSync(source.source)).digest('hex')!==guide.sourceSha256)throw Error('Re-review the replaced source pixels: '+id);const result=align(baseline?.[id]?.crop||guide.referenceCrop||source.crop,guide,policy);if(JSON.stringify(result.crop)===JSON.stringify(source.crop))continue;
 changes.push({id,before:source.crop.slice(),after:result.crop,reasons:result.reasons});if(process.argv.includes('--apply')){
  // Selection framing must not silently reframe a previously approved victory.
  if(!source.presentation&&!source.presentationCrop)source.presentationCrop=source.crop.slice();
  source.presentationFocus??=manifest.characters[id]?.presentationFocus??.5;
  source.crop=result.crop;source.framing='顔位置ガイドに基づく選択用の切り抜き。原画・配色・勝利用の構図を維持。';
 }
}
fs.mkdirSync('previews/selection-framing',{recursive:true});fs.writeFileSync('previews/selection-framing/changes.json',JSON.stringify(changes,null,2));if(process.argv.includes('--apply'))fs.writeFileSync(sourceFile,JSON.stringify(sources,null,2)+'\n');console.log(JSON.stringify({applied:process.argv.includes('--apply'),count:changes.length,ids:changes.map(d=>d.id)}));
