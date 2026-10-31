const fs=require('fs'),sharp=require('sharp');
(async()=>{
 const root='characters/velvet',m=JSON.parse(fs.readFileSync(root+'/tests/art-layout.json')),points=JSON.parse(fs.readFileSync(root+'/tests/native-points.json')),a=await sharp(root+'/assets/velvet-native.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 fs.mkdirSync('previews/velvet/coordinates-marked',{recursive:true});
 for(let start=0;start<106;start+=16){const tiles=[],list=m.frames.slice(start,Math.min(start+16,106));
  for(const[n,r]of list.entries()){
   const id=start+n,w=r[2],h=r[3],left=n%4*420+Math.round((420-w)/2),top=Math.floor(n/4)*400+370-h,p=points.pelvis[id],normal=points.normals.find(v=>v.frame===id),extra=id===55?points.ledge.point:null;
   const svgPoint=(v,color)=>`<circle cx="${v[0]*w}" cy="${v[1]*h}" r="4" fill="${color}" stroke="black"/>`;
   let svg=`<path d="M${m.anchors[id]*w} 0V${h}" stroke="#6eff8b" stroke-opacity=".8"/>${svgPoint(p,'#6eff8b')}`;
   if(normal){svg+=`<path d="M${normal.grip[0]*w} ${normal.grip[1]*h}L${normal.tip[0]*w} ${normal.tip[1]*h}" stroke="#ffda55" stroke-width="2"/>${svgPoint(normal.grip,'#50dfff')}${svgPoint(normal.tip,'#ff695d')}`;}
   if(extra)svg+=svgPoint(extra,'#ffda55');
   tiles.push({input:await sharp(a.data,{raw:a.info}).extract({left:r[0],top:r[1],width:w,height:h}).png().toBuffer(),left,top},{input:Buffer.from(`<svg width="${w}" height="${h}">${svg}</svg>`),left,top},{input:Buffer.from(`<svg width="400" height="26"><text x="5" y="20" fill="white" font-size="18">${id} anchor ${m.anchors[id]}</text></svg>`),left:n%4*420,top:Math.floor(n/4)*400});
  }
  await sharp({create:{width:1680,height:Math.ceil(list.length/4)*400,channels:4,background:'#34425a'}}).composite(tiles).png().toFile('previews/velvet/coordinates-marked/'+start+'.png');
 }
 console.log('Coordinates overlaid on all106 unchanged source crops');
})().catch(e=>{console.error(e);process.exitCode=1;});
