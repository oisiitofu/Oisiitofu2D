// Extract exact existing endpoints for reference and review; never redraw them.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const rects=JSON.parse(fs.readFileSync('assets/ready/manifest.json')).characters.tifa.frames;
const dir=path.resolve(__dirname,'../previews/references');fs.mkdirSync(dir,{recursive:true});
(async()=>{const sheet=JSON.parse(fs.readFileSync('assets/ready/manifest.json')).characters.tifa.image;
for(const n of [9,11,13,17,20,21,22,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]){
 const [left,top,width,height]=rects[n];await sharp(sheet).extract({left,top,width,height}).png().toFile(path.join(dir,'pose-'+n+'.png'));
}console.log(dir);})().catch(e=>{console.error(e);process.exitCode=1});
