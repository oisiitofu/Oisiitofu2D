'use strict';
// Shared by the browser and server so new stages join every selection pool.
const StageCatalog=(()=>{
 const stages=[
  {id:'0',name:'月影の空中神殿',folder:'moonlit-sanctum',previewBackground:'assets/astral-sanctum.png',color:'#73dbff',platforms:[{x:240,y:560,w:960,main:true},{x:360,y:412,w:215},{x:865,y:412,w:215},{x:632,y:300,w:176}]},
  {id:'1',name:'雷鳴の双塔',folder:'thunder-towers',previewBackground:'assets/astral-sanctum.png',color:'#bda3ff',platforms:[{x:160,y:560,w:1120,main:true},{x:310,y:420,w:230},{x:900,y:420,w:230}]},
  {id:'2',name:'蒼天の飛翔艇',theme:'sky',folder:'sky-voyage',color:'#8ceaff',platforms:[{x:280,y:560,w:880,main:true},{x:400,y:390,w:200,motion:{x:150,period:360}},{x:840,y:335,w:180,motion:{y:65,period:300}}]},
  {id:'3',name:'風渡る冒険遺跡',theme:'adventure',folder:'adventure-ruins',color:'#dfba76',platforms:[{x:200,y:560,w:1040,main:true},{x:320,y:400,w:210},{x:910,y:400,w:210},{x:630,y:285,w:180}]},
  {id:'4',name:'星灯りの舞踏宮',theme:'waltz',folder:'starlit-waltz',color:'#e6b8ff',platforms:[{x:300,y:560,w:840,main:true},{x:630,y:355,w:180,motion:{x:235,period:420}},{x:480,y:445,w:180},{x:780,y:445,w:180}]},
  {id:'5',name:'ミッドナイト・セッション',theme:'jazz',folder:'midnight-jazz',color:'#ffc06e',platforms:[{x:250,y:560,w:940,main:true},{x:385,y:380,w:220,motion:{y:55,period:240}},{x:835,y:380,w:220,motion:{y:55,period:240,phase:3.141592653589793}}]},
  {id:'6',name:'紅蓮の天守',theme:'japan',folder:'scarlet-castle',color:'#ffad93',platforms:[{x:285,y:560,w:870,main:true},{x:390,y:405,w:210},{x:840,y:405,w:210},{x:630,y:270,w:180}]},
  {id:'7',name:'ネオン・オーバードライブ',theme:'cyber',folder:'neon-overdrive',color:'#52ffde',platforms:[{x:210,y:560,w:1020,main:true},{x:400,y:390,w:190,motion:{x:145,period:300}},{x:850,y:390,w:190,motion:{x:-145,period:300}}]},
  {id:'8',name:'灼熱の決戦炉',theme:'fire',folder:'blazing-forge',color:'#ffb04c',platforms:[{x:270,y:560,w:900,main:true},{x:620,y:355,w:200,motion:{y:70,period:360}},{x:355,y:420,w:185},{x:900,y:420,w:185}]},
  {id:'9',name:'フェスティバル・パレード',theme:'festival',folder:'festival-parade',color:'#ff9bd8',platforms:[{x:190,y:560,w:1060,main:true},{x:340,y:390,w:200,motion:{y:40,period:300}},{x:900,y:390,w:200,motion:{y:-40,period:300}},{x:630,y:285,w:180}]},
  {id:'10',name:'水鏡の花園',theme:'beauty',folder:'mirror-garden',color:'#9ce4cf',platforms:[{x:300,y:560,w:840,main:true},{x:410,y:395,w:200},{x:830,y:395,w:200},{x:630,y:290,w:180,motion:{x:90,period:480}}]},
  {id:'11',name:'ギアワーク・ファクトリー',theme:'factory',folder:'gearwork-factory',color:'#ffbf62',platforms:[{x:250,y:560,w:940,main:true},{x:345,y:405,w:190,motion:{y:80,period:300}},{x:905,y:405,w:190,motion:{y:80,period:300,phase:3.141592653589793}}]},
  {id:'12',name:'チャンピオンズ・スタジアム',theme:'sports',folder:'champions-stadium',color:'#7ee6c7',platforms:[{x:190,y:560,w:1060,main:true},{x:405,y:380,w:210},{x:825,y:380,w:210}]}
 ];
 const draw=n=>Math.floor(Math.random()*n);
 const normalize=id=>id==='random'||stages.some(s=>s.id===id)?id:stages[0].id;
 const resolve=(id,choose=draw)=>normalize(id)==='random'?stages[choose(stages.length)].id:normalize(id);
 const chooseOnline=(choices,choose=draw)=>resolve(choices[choose(choices.length)],choose);
 const get=id=>stages.find(s=>s.id===id)||stages[0];
 const name=id=>id==='random'?'おまかせ':get(id).name;
 return{stages,normalize,resolve,chooseOnline,get,name};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=StageCatalog;
