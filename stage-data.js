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
  {id:'12',name:'チャンピオンズ・スタジアム',theme:'sports',folder:'champions-stadium',color:'#7ee6c7',platforms:[{x:190,y:560,w:1060,main:true},{x:405,y:380,w:210},{x:825,y:380,w:210}]},
  {id:'13',name:'深海観測窓',theme:'abyss',folder:'abyss-observatory',color:'#62dccc',layout:'2台の観測リフトが楕円を周回',platforms:[
   {x:250,y:560,w:940,main:true},
   {x:636,y:430,w:168,motion:{x:150,y:72,phaseY:Math.PI/2,period:480}},
   {x:636,y:286,w:168,motion:{x:150,y:72,phase:Math.PI,phaseY:Math.PI/2,period:480}}
  ]},
  {id:'14',name:'極光の氷窟',theme:'aurora',folder:'aurora-grotto',color:'#a3dcff',layout:'崖の外に張り出す氷棚',platforms:[
   {x:310,y:560,w:820,main:true},{x:140,y:480,w:205},{x:1095,y:480,w:205},{x:624,y:340,w:192}
  ]},
  {id:'15',name:'星詠みの書庫',theme:'archive',folder:'starlit-archive',color:'#ffd397',layout:'高さの違う4つの書棚',platforms:[
   {x:220,y:560,w:1000,main:true},{x:330,y:455,w:155},{x:525,y:372,w:160},{x:758,y:295,w:176},{x:965,y:427,w:196}
  ]},
  {id:'16',name:'折り紙工房',theme:'origami',folder:'origami-workshop',color:'#ffe2ad',layout:'斜めに折り替わる和紙の足場',platforms:[
   {x:285,y:560,w:870,main:true},
   {x:310,y:468,w:188,motion:{path:[[0,0,0],[45,0,0],[180,210,-113],[285,210,-113],[435,0,0],[480,0,0]]}},
   {x:935,y:370,w:182,motion:{path:[[0,0,0],[78,0,0],[216,-165,104],[330,-165,104],[475,0,0],[480,0,0]]}}
  ]},
  {id:'17',name:'胞子の洞窟',theme:'mycelium',folder:'spore-cavern',color:'#eaa5ed',layout:'中央の菌床が上昇してしばらく滞在',platforms:[
   {x:215,y:560,w:1010,main:true},{x:355,y:380,w:165},{x:920,y:380,w:165},
   {x:560,y:474,w:320,motion:{path:[[0,0,0],[100,0,0],[225,0,-172],[345,0,-172],[475,0,0],[540,0,0]]}}
  ]},
  {id:'18',name:'宵越しの夜行列車',theme:'rail',folder:'midnight-express',color:'#ffc482',layout:'保線車が上下2段の経路を周回',platforms:[
   {x:190,y:560,w:1060,main:true},{x:1038,y:396,w:154},
   {x:340,y:436,w:170,motion:{path:[[0,0,0],[35,0,0],[200,510,0],[262,510,-114],[422,0,-114],[485,0,0],[520,0,0]]}}
  ]},
  {id:'19',name:'塩湖の鏡面桟橋',theme:'salt',folder:'salt-mirror-pier',color:'#a7e7f1',layout:'崖の外から主足場の下へ回り込める',platforms:[
   {x:295,y:521,w:850,main:true,depth:54},{x:112,y:681,w:1216}
  ]},
  {id:'20',name:'白磁の焼き物市',theme:'porcelain',folder:'porcelain-market',color:'#adc9ff',layout:'中央に寄る2枚の足場が左右に開く',platforms:[
   {x:212,y:560,w:1016,main:true},
   {x:482,y:400,w:216,motion:{path:[[0,0,0],[110,0,0],[235,-175,0],[355,-175,0],[480,0,0],[540,0,0]]}},
   {x:742,y:400,w:216,motion:{path:[[0,0,0],[110,0,0],[235,175,0],[355,175,0],[480,0,0],[540,0,0]]}}
  ]},
  {id:'21',name:'影絵の野外劇場',theme:'shadow',folder:'shadow-puppet-theatre',color:'#ffc98e',layout:'照明の合図で左・中央・右の足場が順に上昇',platforms:[
   {x:232,y:560,w:976,main:true},
   {x:325,y:451,w:183,motion:{path:[[0,0,0],[82,0,0],[164,0,-113],[235,0,-113],[292,0,0],[720,0,0]]}},
   {x:625,y:436,w:190,motion:{path:[[0,0,0],[287,0,0],[369,0,-134],[440,0,-134],[497,0,0],[720,0,0]]}},
   {x:932,y:461,w:183,motion:{path:[[0,0,0],[492,0,0],[574,0,-113],[645,0,-113],[702,0,0],[720,0,0]]}}
  ]},
  {id:'22',name:'巨木の空洞',theme:'hollow',folder:'redwood-hollow',color:'#d5e6a0',layout:'左右2段の枝が中央の吹き抜けを挟む',platforms:[
   {x:248,y:560,w:944,main:true},{x:268,y:424,w:237},{x:236,y:274,w:226},
   {x:935,y:454,w:237},{x:845,y:310,w:227}
  ]}
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
