'use strict';
const fs=require('fs'),crypto=require('crypto'),sharp=require('sharp'),vm=require('vm'),root='characters/yuma';
const moduleBox={exports:{}};vm.runInNewContext(fs.readFileSync('characters/elza/tests/extract-poses.cjs','utf8').replace('return{pixels:out,w:nw,h:nh,cell};','return{pixels:out,w:nw,h:nh,cell,origin:[b.x1-3,b.y1-3]};'),{module:moduleBox,Buffer,Int16Array,Uint8Array,Uint32Array,Int32Array,Math,Array,Error});const extract=moduleBox.exports;
const waists={
 basic:[[236,181],[595,176],[947,175],[1330,177],[255,436],[597,458],[992,439],[1346,439],[235,657],[591,671],[978,710],[1333,657],[235,924],[589,911],[973,918],[1334,920]],
 attacks:[[216,177],[556,181],[952,181],[1332,186],[247,436],[563,439],[953,482],[1338,429],[239,684],[567,687],[964,724],[1350,661],[243,926],[574,923],[961,924],[1327,924]],
 specials:[[237,184],[594,186],[950,184],[1330,186],[218,433],[593,434],[950,466],[1330,443],[235,686],[596,664],[952,696],[1335,680],[224,930],[587,926],[961,925],[1346,931]],
 defense:[[212,184],[586,189],[986,146],[1350,133],[220,454],[580,417],[959,399],[1343,431],[204,684],[606,683],[1001,683],[1381,658],[210,923],[588,922],[981,939],[1340,927]],
 extra:[[233,180],[594,187],[981,225],[1345,180],[224,459],[595,455],[970,447],[1342,445],[242,691],[602,678],[973,724],[1346,694],[250,942],[593,933],[957,964],[1345,937]],
 windup:[[226,183],[570,174],[955,180],[1337,178],[233,432],[588,454],[952,465],[1343,435],[226,684],[596,688],[967,727],[1367,650],[259,927],[580,938],[987,911],[1359,934]],
 recovery:[[171,183],[552,180],[938,180],[1308,181],[198,425],[586,441],[952,467],[1345,424],[204,678],[579,683],[952,710],[1357,645],[202,899],[595,926],[981,900],[1334,910]]
};
(async()=>{
 const sheets={},poses=[],evidence=[],sources=[];for(const k of Object.keys(waists))sheets[k]=extract(await sharp(root+'/assets/yuma-'+k+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),4,4,k);
 const normalize=(g,p)=>[(p[0]-g.origin[0])/g.w,(p[1]-g.origin[1])/g.h];
 for(const[k,list]of Object.entries(sheets))for(let c=0;c<list.length;c++){if(!c&&k!=='basic')continue;const g=list[c];poses.push(g);sources.push({sheet:k,cell:c});evidence.push({index:evidence.length,sheet:k,cell:c,sourceOrigin:g.origin,sourceDimensions:[g.w,g.h],sourceWaist:waists[k][c],waist:normalize(g,waists[k][c]),method:'Visible uniform belt/pelvis centre manually marked in original whole-figure pixels; no weapon/cape bounding-box midpoint.'});}
 const correction=extract(await sharp(root+'/assets/yuma-upair-correction.png').raw().toBuffer({resolveWithObject:true}),1,1,'correction')[0];evidence[29]={index:29,sheet:'upair-correction',cell:0,sourceOrigin:correction.origin,sourceDimensions:[correction.w,correction.h],sourceWaist:[841,740],waist:normalize(correction,[841,740]),method:'Visible belt centre in independent full-body corrected up-aerial; hat-width scale .373.'};
 const hg=sheets.defense[10],hand=[988,519],ledge={pose:55,sourceHand:hand,normalized:normalize(hg,hand)};
 fs.writeFileSync(root+'/tests/body-axis-evidence.json',JSON.stringify({poses:evidence,ledge},null,2));
 const tips=[[[625,132],[757,118]],[[1037,91],[1115,20]],[[1414,145],[1525,150]],[[309,409],[416,445]],[[598,339],[674,257]],[[992,491],[1115,507]],[[1414,410],[1524,418]],[[259,651],[433,647]],[[549,582],[568,495]],[[980,727],[1112,745]],[[1398,674],[1500,728]],[[271,951],[367,1004]],[[552,891],[419,868]],[[699,316],[702,15]],[[1336,903],[1332,992]]];
 const normals=tips.map((p,n)=>{const g=n===13?correction:sheets.attacks[n+1];return{index:n,pose:16+n,grip:normalize(g,p[0]),tip:normalize(g,p[1]),sourceGrip:p[0],sourceTip:p[1],source:n===13?'upair-correction':'attacks'};});
 const specialHand=[[592,144],[995,123],[1425,120],[347,381],[691,384],[1059,465],[1406,453],[297,576],[639,650],[1082,688],[1409,648],[235,871],[702,846],[1094,930],[1361,929]];
 fs.writeFileSync(root+'/tests/native-points.json',JSON.stringify({coordinateSpace:'normalized cropped frame, x from left y from top; grip and rigid weapon tip marked directly on source art',normals,specials:specialHand.map((p,n)=>({cell:n+1,pose:31+n,hand:normalize(sheets.specials[n+1],p),sourceHand:p})),ledge},null,2));
 const records=[];for(const name of fs.readdirSync(root+'/assets').filter(n=>n.endsWith('.png'))){const p=root+'/assets/'+name,meta=await sharp(p).metadata();records.push({file:p,sha256:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),width:meta.width,height:meta.height,hasAlpha:meta.hasAlpha});}fs.writeFileSync(root+'/tests/source-hashes.json',JSON.stringify(records,null,2));
 console.log({poses:evidence.length,waistRange:[Math.min(...evidence.map(p=>p.waist[0])),Math.max(...evidence.map(p=>p.waist[0]))],ledge});
})().catch(e=>{console.error(e);process.exitCode=1});
