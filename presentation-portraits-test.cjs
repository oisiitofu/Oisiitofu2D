'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),sharp=require('sharp');
(async()=>{const m=JSON.parse(fs.readFileSync('assets/ready/manifest.json')),ids=['dietrich','narmaya','io','velvet','namine','hydaelyn','magus','odio'];let checks=0;
 for(const id of ids){const entry=m.characters[id],source=await sharp(entry.selectionSource).metadata(),[left,top,width,height]=entry.selectionCrop;assert.equal(entry.presentationPortraits.length,5);
  for(let color=0;color<5;color++){const file=entry.presentationPortraits[color],meta=await sharp(file).metadata();assert.deepEqual([meta.width,meta.height],[source.width,source.height]);assert.ok(meta.width>width&&meta.height>height,'victory retains pixels outside the card crop');
   const expected=await sharp(entry.selectionPortraits[color]).ensureAlpha().raw().toBuffer(),actual=await sharp(file).extract({left,top,width,height}).ensureAlpha().raw().toBuffer();for(const bytes of[actual,expected])for(let p=0;p<bytes.length;p+=4)if(!bytes[p+3])bytes.fill(0,p,p+3);assert.equal(Buffer.compare(actual,expected),0,id+' color '+color+' preserves native crop/alpha/palette');checks++;
  }
 }
 console.log(JSON.stringify({passed:true,characters:ids.length,nativeColorComparisons:checks}));
})().catch(e=>{console.error(e);process.exitCode=1;});
