'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),sharp=require('sharp'),sources=require('./.tools/selection-portrait-sources.json');
(async()=>{const m=JSON.parse(fs.readFileSync('assets/ready/manifest.json')),ids=['dietrich','narmaya','io','velvet','namine','hydaelyn','magus','odio'];let checks=0;
 for(const id of ids){const entry=m.characters[id],victorySource=sources[id].presentationSource||entry.selectionSource,source=await sharp(victorySource).metadata(),[left,top,width,height]=entry.selectionCrop;assert.equal(entry.presentationPortraits.length,5);
  for(let color=0;color<5;color++){const file=entry.presentationPortraits[color],meta=await sharp(file).metadata();assert.deepEqual([meta.width,meta.height],[source.width,source.height]);
   if(victorySource!==entry.selectionSource){
    const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,16);assert.ok(file.includes('-'+hash+'.'),'approved victory remains content addressed');
    const alpha=await sharp(file).extractChannel('alpha').raw().toBuffer(),base=await sharp(entry.presentationPortraits[0]).extractChannel('alpha').raw().toBuffer();assert.equal(Buffer.compare(alpha,base),0,'separate victory colors preserve the native silhouette');checks++;continue;
   }
   assert.ok(meta.width>width&&meta.height>height,'victory retains pixels outside the card crop');
   // Authored card crops can include transparent headroom outside the native
   // source. Match canvas clipping/padding before comparing the visible pixels.
   const pad={left:Math.max(0,-left),top:Math.max(0,-top),right:Math.max(0,left+width-meta.width),bottom:Math.max(0,top+height-meta.height)};
   const padded=await sharp(file).ensureAlpha().extend({...pad,background:'#00000000'}).png().toBuffer();
   const expected=await sharp(entry.selectionPortraits[color]).ensureAlpha().raw().toBuffer(),actual=await sharp(padded).extract({left:left+pad.left,top:top+pad.top,width,height}).raw().toBuffer();for(const bytes of[actual,expected])for(let p=0;p<bytes.length;p+=4)if(!bytes[p+3])bytes.fill(0,p,p+3);assert.equal(Buffer.compare(actual,expected),0,id+' color '+color+' preserves native crop/alpha/palette');checks++;
  }
 }
 console.log(JSON.stringify({passed:true,characters:ids.length,nativeColorComparisons:checks}));
})().catch(e=>{console.error(e);process.exitCode=1;});
