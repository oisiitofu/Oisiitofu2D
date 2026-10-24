'use strict';
// Original, deterministic impact DSP. Rebuilds contact sounds only: no BGM,
// movement, UI, announcer or blade swing assets are touched.
const fs=require('node:fs'),path=require('node:path');
const SR=48000,TAU=Math.PI*2,root=__dirname;
const families=['punch','sword','spear','staff','hammer','claw','bullet','beam','fire','ice','thunder','wind','water','earth','light','dark'];
const key=(family,heavy)=>family==='punch'?'punch-'+(heavy?'heavy':'light'):family+'-hit'+(heavy?'-heavy':'');
function rng(seed){return()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};}
const env=(t,decay,attack=.0006)=>t<0?0:(1-Math.exp(-t/attack))*Math.exp(-t/decay);
function bandpass(hz,q=.8){let x1=0,x2=0,y1=0,y2=0;const w=TAU*hz/SR,a=Math.sin(w)/(2*q),d=1/(1+a);return x=>{const y=(a*(x-x2)+2*Math.cos(w)*y1-(1-a)*y2)*d;x2=x1;x1=x;y2=y1;y1=y;return y;};}
function render(family,heavy,variant){
 const random=rng(912701+families.indexOf(family)*7817+variant*313+Number(heavy)*9791),pitch=.975+variant*.025;
 const decay=heavy?1.38:1,duration=(family==='bullet'?.17:['sword','spear','claw'].includes(family)?.21:['light','ice','dark'].includes(family)?.32:.25)*(heavy?1.42:1),N=Math.round(duration*SR),dry=new Float32Array(N);
 const low=bandpass(150,.65),mid=bandpass(950,.7),edge=bandpass(4700,1.1),air=bandpass(2400,.65);let p=0,p2=0,lp=0;
 for(let n=0;n<N;n++){
  const t=n/SR,noise=(random()+random()+random()-1.5)*1.1547,l=low(noise),m=mid(noise),hi=edge(noise),a=air(noise);lp+=.018*(noise-lp);
  const thud=(f=145,d=.032)=>{p+=TAU*(f*pitch*Math.exp(-t*35)+48)/SR;return Math.sin(p)*env(t,d*decay);};
  let s=0;
  switch(family){
   case'punch':s=thud(heavy?165:205,heavy?.052:.027)*.95+m*1.7*env(t,.019*decay)+hi*.55*env(t,.0035);break;
   // A cut is air and a moving razor transient, never a stationary bell clang.
   case'sword':case'spear':case'claw':{
    const narrow=family==='spear',rake=family==='claw';p+=TAU*(narrow?6200:5100)*pitch*(1+.65*Math.exp(-t*100))/SR;
    s=hi*1.9*env(t,.008*decay)+a*1.25*env(t,.022*decay)+Math.sin(p+Math.sin(p*1.61)*.48)*.15*env(t,.009);
    s+=m*(heavy?.9:.42)*env(t,.011*decay);
    if(heavy)s+=l*1.7*env(t,.027)+Math.sin(TAU*(90*t+.6*(1-Math.exp(-t*50))))*.21*env(t,.028);
    if(rake)s+=hi*.65*env(t-.009,.013)+a*.48*env(t-.018,.012);
    if(narrow)s+=hi*.55*env(t-.003,.005);break;
   }
   case'staff':s=thud(280,.025)*.5+m*2.5*env(t,.015*decay)+hi*.6*env(t,.004)+Math.sin(TAU*710*pitch*t)*.17*env(t,.026);break;
   case'hammer':s=thud(115,.068)*1.05+l*3.4*env(t,.054*decay)+m*1.4*env(t,.021)+hi*.38*env(t,.004);break;
   case'bullet':s=hi*2.4*env(t,.0023)+m*2.1*env(t,.009*decay)+thud(290,.016)*.28;break;
   case'beam':p+=TAU*(2600-1500*(1-Math.exp(-t*34)))*pitch/SR;s=hi*1.15*env(t,.004)+Math.sin(p+Math.sin(p*.51)*1.8)*.42*env(t,.039*decay)+a*.65*env(t,.018);break;
   case'fire':s=thud(110,.042)*.6+l*3.4*env(t,.048*decay)+m*1.4*env(t,.028)+hi*(.6+.4*Math.sin(TAU*83*t))*env(t,.024);break;
   case'ice':s=hi*1.5*env(t,.005)+a*.8*env(t,.018);for(const [f,d]of[[3200,.033],[4973,.022],[7187,.015]])s+=Math.sin(TAU*f*pitch*t)*.2*env(t,d*decay);break;
   case'thunder':p+=TAU*(1350+650*Math.exp(-t*30))*pitch/SR;s=hi*1.7*env(t,.004)+m*(1+.6*Math.sin(TAU*94*t))*env(t,.032*decay)+Math.sin(p+Math.sin(p*.73)*3)*.33*env(t,.028*decay)+l*1.8*env(t,.038);break;
   case'wind':s=a*2.3*env(t,.036*decay,.0018)+hi*.6*env(t,.004)+m*.75*env(t,.028);break;
   case'water':p+=TAU*(1250*Math.exp(-t*20)+240)*pitch/SR;p2+=TAU*(2100*Math.exp(-t*27)+510)*pitch/SR;s=hi*.9*env(t,.004)+a*1.3*env(t,.026*decay)+Math.sin(p+Math.sin(p2)*.65)*.38*env(t,.037*decay)+m*.5*env(t,.024);break;
   case'earth':s=thud(95,.059)*.8+l*3.4*env(t,.055*decay)+m*1.5*env(t,.019)+hi*.6*env(t,.005)+m*.45*env(t-.014,.025);break;
   case'light':s=hi*1.1*env(t,.005)+a*.65*env(t,.022);for(const[f,g]of[[1046,.21],[1568,.16],[2637,.1]])s+=Math.sin(TAU*f*pitch*t)*g*env(t,.055*decay);break;
   case'dark':p+=TAU*(150+190*Math.exp(-t*22))*pitch/SR;s=m*1.15*env(t,.024)+hi*.65*env(t,.004)+Math.sin(p+Math.sin(p*.497)*1.3)*.55*env(t,.06*decay)+lp*2.3*env(t,.055);break;
  }
  // A fast dry contact stays in the centre. Only the quiet tail is widened.
  dry[n]=Math.tanh(s*.85)*Math.min(1,t/.0002)*Math.min(1,(N-n)/(SR*.008));
 }
 const l=new Float32Array(N),r=new Float32Array(N);let peak=0;
 for(let n=0;n<N;n++){const tail=(dry[n-677]||0)*.055+(dry[n-1547]||0)*.025,fade=Math.min(1,(N-1-n)/(SR*.012));l[n]=(dry[n]+tail)*fade;r[n]=(dry[n]+(dry[n-811]||0)*.055+(dry[n-1789]||0)*.025)*fade;peak=Math.max(peak,Math.abs(l[n]),Math.abs(r[n]));}
 const gain=(heavy?.79:.72)/Math.max(.001,peak);for(let n=0;n<N;n++){l[n]*=gain;r[n]*=gain;}return{l,r};
}
function wav({l,r}){const b=Buffer.alloc(44+l.length*4);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(l.length*4,40);for(let n=0;n<l.length;n++){b.writeInt16LE(Math.round(l[n]*32767),44+n*4);b.writeInt16LE(Math.round(r[n]*32767),46+n*4);}return b;}
function build(){const file=path.join(root,'assets/audio/se/manifest.json'),manifest=JSON.parse(fs.readFileSync(file));for(const family of families)for(const heavy of[false,true]){const name=key(family,heavy);manifest.sounds[name]=[];for(let v=0;v<3;v++){const url='/assets/audio/se/'+name+'-'+(v+1)+'.wav';fs.writeFileSync(path.join(root,url),wav(render(family,heavy,v)));manifest.sounds[name].push(url);}}manifest.impactDesign={version:2,families,variants:3,weight:'light/heavy',generator:'build-hit-audio.cjs'};fs.writeFileSync(file,JSON.stringify(manifest,null,2)+'\n');console.log('Built 96 original contact WAVs: 16 families, 2 weights, 3 variants.');}
if(require.main===module)build();
module.exports={families,key,render,wav,build};
