'use strict';
const BattleSize=(()=>{
 // Keep authored combat geometry independent of display calibration.
 const physicsHeights={ulgrim:110,roxas:96,twob:98,rin:96,lightning:98,colette:94,
  rean:100,estelle:94,noctis:98,clive:104,makoto:96,neku:94,narukami:100,
  naegi:92,rex:98,luke:100,will:96,kosmos:100,fayt:98,emma:96,ryza:96,
  noah:98,lloyd:96,hunter:104,adol:98,valkyrie:100,haseo:100,akira:100,
  morphie:100,fei:98,human:92,kitten:96,elma:98,goemon:90,nier:98,
  miku:96,naruhodo:100};
 // These later characters authored collision geometry against their larger
 // sprites. Older characters already have compact bodies and keep that data.
 const geometryIds=new Set(['haseo','fei','human','kitten','elma','goemon','nier','miku','naruhodo']);
 function sourceNative(id,n){return id==='haseo'?haseoNativeScale(n):id==='kisuke'?kisukeNativeScale(n): id==='hanajd'?hanajdNativeScale(n): id==='hanajk'?hanajkNativeScale(n): id==='hanajs'?hanajsNativeScale(n): id==='shizuna'?shizunaNativeScale(n): id==='donchan'?donchanNativeScale(n): id==='omegamon'?omegamonNativeScale(n): id==='wargreymon'?wargreymonNativeScale(n): id==='metalgreymon'?metalgreymonNativeScale(n): id==='greymon'?greymonNativeScale(n): id==='moogle'?moogleNativeScale(n): id==='doshin'?doshinNativeScale(n): id==='aerith'?aerithNativeScale(n): id==='saki'?sakiNativeScale(n): id==='shadow'?shadowNativeScale(n): id==='kasane'?kasaneNativeScale(n): id==='deemo'?deemoNativeScale(n): id==='laharl'?laharlNativeScale(n): id==='odio'?odioNativeScale(n): id==='eve'?eveNativeScale(n): id==='tressa'?tressaNativeScale(n): id==='frog'?frogNativeScale(n): id==='rocbouquet'?rocbouquetNativeScale(n): id==='sumino'?suminoNativeScale(n): id==='maelle'?maelleNativeScale(n): id==='knight'?knightNativeScale(n): id==='arus'?arusNativeScale(n): id==='pneuma'?pneumaNativeScale(n): id==='sukapon'?sukaponNativeScale(n): id==='guile'?guileNativeScale(n): id==='edelgard'?edelgardNativeScale(n): id==='edf'?edfNativeScale(n): id==='dietrich'?dietrichNativeScale(n): id==='maruku'?marukuNativeScale(n): id==='aruru'?aruruNativeScale(n): id==='twinbee'?twinbeeNativeScale(n): id==='piposaru'?piposaruNativeScale(n): id==='mametchi'?mametchiNativeScale(n): id==='ryofu'?ryofuNativeScale(n): id==='charlotta'?charlottaNativeScale(n): id==='crash'?crashNativeScale(n): id==='kiryu'?kiryuNativeScale(n): id==='vincent'?vincentNativeScale(n): id==='yuffie'?yuffieNativeScale(n): id==='zidane'?zidaneNativeScale(n): id==='tifa'?tifaNativeScale(n): id==='leon'?leonNativeScale(n): id==='dante'?danteNativeScale(n): id==='layton'?laytonNativeScale(n): id==='jibanyan'?jibanyanNativeScale(n):id==='naruhodo'?naruhodoNativeScale(n):id==='miku'?mikuNativeScale(n):id==='nier'?nierNativeScale(n):id==='metabee'?metabeeNativeScale(n):id==='bayleef'?bayleefNativeScale(n):id==='goemon'?goemonNativeScale(n):id==='elma'&&n>=40&&n<56?.82:id==='fei'?.72:n>=24&&n<40?.57:.72;}
 // Offline opaque-body measurements; no pixel analysis during game startup.
 // Heights include hats/helmets that define the silhouette, not transparent borders.
 const calibration={
  "dragoon":{"height":96,"body":179,"neutral":1,"pads":[2,2,2,2,2,7,3,2,2,2,2,10,2,2,2,2,2,2,2,3,2,2,2,8,2,2,2,2,2,2,2,2,3,3,3,2,3,2,2,2]},
  "isaac":{"height":102,"body":197,"neutral":1,"pads":[3,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,3,2,5,2,3,3,3,3,3,3,3,3,3,2,2,3,3,2,2,3,3]},
  "ulgrim":{"height":120,"body":262,"neutral":1,"pads":[2,3,2,3,3,6,3,3,2,3,3,3,3,3,3,3,2,3,3,3,3,3,3,2,3,3,3,3,2,3,2,2,3,2,3,4,3,3,3,3]},
  "chiikawa":{"height":76,"body":174,"neutral":1,"pads":[3,3,3,2,9,3,2,3,3,3,8,4,3,2,3,3,7,3,2,3,3,2,3,6,3,3,3,3,3,3,4,4,3,3,3,3,4,4,3,4]},
  "chocobo":{"height":114,"body":234,"neutral":1,"pads":[4,3,3,4,3,3,3,3,4,4,3,4,3,3,3,3,4,3,4,3,5,3,4,4,5,4,3,4,4,5,5,4,6,4,4,3,6,6,4,4]},
  "monokuma":{"height":92,"body":224,"neutral":1,"pads":[3,3,3,3,3,2,3,3,3,3,3,3,3,2,3,8,3,3,2,3,3,3,2,3,2,2,3,3,2,2,2,2,2,3,2,2,3,3,3,2]},
  "riki":{"height":86,"body":211,"neutral":1,"pads":[2,3,3,4,3,3,3,3,3,4,4,3,3,3,3,3,3,3,2,4,2,2,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,4,3,3]},
  "roxas":{"height":102,"body":238,"neutral":1,"pads":[2,2,2,3,3,2,2,0,1,5,3,6,3,3,0,1,3,0,2,4,2,5,4,3,1,0,1,1,1,1,1,1,1,1,2,1,1,1,1,0]},
  "twob":{"height":110,"body":244,"neutral":1,"pads":[2,3,3,2,3,4,3,3,3,2,3,3,3,3,2,3,3,3,3,3,3,4,3,3,2,3,3,3,3,3,3,2,3,3,3,4,3,3,3,5]},
  "okami":{"height":82,"body":171,"neutral":1,"pads":[3,2,3,3,2,3,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,4,3,3]},
  "gundam":{"height":120,"body":210,"neutral":1,"pads":[3,3,3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,3,3,3,2,3,3,3,2,2,2,2,2,2,2,3,2,2,3,2,3,3,2,2]},
  "vivi":{"height":86,"body":211,"neutral":1,"pads":[3,3,3,2,3,2,3,2,3,2,3,3,3,3,3,3,3,2,2,3,2,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]},
  "zero":{"height":108,"body":206,"neutral":1,"pads":[2,2,3,3,3,3,2,2,3,3,3,4,3,3,3,3,3,3,3,7,3,4,2,3,3,2,3,2,2,3,3,3,2,2,2,3,2,3,3,3]},
  "rin":{"height":108,"body":252,"neutral":1,"pads":[3,2,3,2,3,2,4,3,3,3,3,3,3,3,3,3,2,3,2,3,2,4,5,3,3,3,3,3,3,3,2,3,2,3,3,4,2,3,2,3]},
  "nia":{"height":100,"body":195,"neutral":1,"pads":[3,3,3,3,3,2,2,2,2,3,2,2,3,2,3,3,4,3,2,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]},
  "lightning":{"height":110,"body":260,"neutral":1,"pads":[2,3,2,6,3,3,2,2,3,3,3,3,3,3,3,2,2,2,3,2,3,4,4,2,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,2]},
  "colette":{"height":102,"body":236,"neutral":1,"pads":[2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,3,3,2,3,3,3,2,3,2,2,3,2,3,2,2,2]},
  "rean":{"height":112,"body":249,"neutral":1,"pads":[2,3,3,3,4,5,3,2,2,3,3,4,2,2,3,3,3,2,3,4,2,4,3,3,3,3,3,3,3,3,2,3,3,3,2,3,3,3,3,3]},
  "estelle":{"height":104,"body":225,"neutral":1,"pads":[3,2,2,2,2,2,2,2,2,2,3,3,2,2,2,3,2,2,2,2,2,2,2,2,3,2,3,3,2,3,3,3,3,2,3,3,2,2,3,2]},
  "noctis":{"height":110,"body":270,"neutral":1.05,"pads":[3,3,3,3,3,2,1,1,3,3,3,7,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,2,2,3,3,3,2]},
  "clive":{"height":116,"body":258,"neutral":1.05,"pads":[2,4,3,3,3,3,4,3,3,3,3,3,4,3,4,3,4,3,3,5,3,3,2,6,3,4,4,4,4,4,4,5,5,4,5,4,4,4,5,5]},
  "makoto":{"height":106,"body":253,"neutral":1.05,"pads":[3,3,3,4,3,3,2,2,3,3,3,3,3,3,3,2,2,2,3,4,3,3,3,2,4,3,4,4,4,3,4,4,4,3,3,4,5,4,4,4]},
  "neku":{"height":102,"body":252,"neutral":1,"pads":[3,3,2,3,3,2,3,3,2,2,2,3,2,3,2,3,3,3,2,3,2,2,4,3,3,3,3,3,3,4,3,4,3,4,3,3,3,4,3,3]},
  "narukami":{"height":112,"body":255,"neutral":1,"pads":[2,3,3,3,4,3,3,3,3,4,3,7,2,3,3,3,3,3,3,3,3,3,2,3,3,4,3,4,4,4,4,4,4,4,4,5,4,4,3,5]},
  "naegi":{"height":100,"body":254,"neutral":1.06,"pads":[3,2,3,3,2,2,3,2,3,2,3,3,3,3,2,4,3,3,2,3,3,3,3,3,4,4,3,3,4,3,3,4,3,4,3,3,4,4,4,4]},
  "rex":{"height":104,"body":253,"neutral":1,"pads":[3,3,3,3,3,3,3,3,3,2,1,6,3,3,3,3,1,3,3,3,4,4,4,4,3,3,4,3,4,3,3,4,3,3,4,3,3,3,3,4]},
  "luke":{"height":110,"body":251,"neutral":1.04,"pads":[3,3,2,3,3,3,2,1,4,3,3,7,4,3,4,4,3,3,4,3,6,3,3,7,3,4,4,4,4,3,4,3,4,4,3,3,5,3,4,4]},
  "will":{"height":104,"body":254,"neutral":1,"pads":[3,3,2,3,3,8,2,3,3,3,3,8,2,2,2,3,3,3,2,3,3,3,4,3,4,4,3,3,4,3,4,3,3,3,4,3,4,3,4,4]},
  "kosmos":{"height":112,"body":252,"neutral":1,"pads":[3,2,3,3,3,3,3,2,2,3,3,1,2,2,3,3,3,3,2,3,3,3,4,6,4,4,3,4,3,3,5,4,4,4,4,4,4,5,5,4]},
  "fayt":{"height":108,"body":254,"neutral":1,"pads":[3,3,2,3,3,3,3,2,3,3,3,4,2,2,3,3,3,3,3,4,3,3,3,2,3,3,3,3,4,4,4,4,3,4,3,4,3,3,4,4]},
  "emma":{"height":104,"body":255,"neutral":1,"pads":[2,3,2,3,3,4,1,3,3,1,1,8,3,3,3,2,3,3,3,2,5,3,3,3,3,4,4,4,3,3,3,1,4,3,4,5,3,4,5,4]},
  "ryza":{"height":106,"body":255,"neutral":1,"pads":[3,3,2,2,2,4,3,2,2,2,3,4,3,3,3,3,3,3,2,2,4,4,3,3,3,4,4,4,3,3,4,4,4,3,3,4,4,4,4,4]},
  "noah":{"height":108,"body":252,"neutral":1,"pads":[3,3,3,3,2,5,3,2,3,3,1,5,3,3,3,3,3,4,3,3,3,3,3,3,4,4,3,4,3,4,3,4,4,4,4,4,4,3,4,4]},
  "midna":{"height":88,"body":214,"neutral":1,"pads":[3,3,3,3,3,3,3,2,3,3,3,3,3,3,2,3,2,3,3,3,3,3,2,3,3,3,3,3,3,2,3,3,3,3,3,3,3,3,3,3]},
  "bomberman":{"height":86,"body":215,"neutral":1,"pads":[3,2,2,3,2,2,2,3,3,3,3,3,3,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3,4,3,3]},
  "sans":{"height":84,"body":216,"neutral":1,"pads":[2,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,3,2,2,3,3,3,3,2,3,4,4,3,3,3,4,3,3,3,4,4,3,3,3,3]},
  "lloyd":{"height":104,"body":253,"neutral":1,"pads":[2,4,3,3,3,3,2,3,3,2,3,5,3,2,3,3,3,3,3,3,3,4,3,8,3,4,3,4,3,4,3,4,3,4,4,4,3,4,4,4]},
  "shiren":{"height":108,"body":214,"neutral":1,"pads":[3,3,2,3,3,3,2,2,2,3,3,3,2,2,2,3,3,3,2,3,3,3,3,3,2,3,4,3,4,3,3,4,3,3,3,3,3,3,4,3]},
  "pokoa":{"height":88,"body":215,"neutral":1,"pads":[2,3,3,3,3,3,3,3,2,2,2,3,3,3,3,2,3,3,3,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3]},
  "hunter":{"height":116,"body":254,"neutral":1.05,"pads":[3,3,3,3,3,3,1,3,3,1,4,3,3,3,3,3,3,1,3,3,6,3,2,1,3,3,3,3,2,3,2,3,3,3,3,3,3,3,3,3]},
  "adol":{"height":108,"body":251,"neutral":1.04,"pads":[3,3,3,3,3,3,3,3,3,3,3,6,3,2,2,2,3,3,2,3,3,3,3,6,3,3,3,3,4,4,4,3,4,3,4,4,4,4,4,3]},
  "terry":{"height":112,"body":214,"neutral":1,"pads":[3,2,3,3,2,3,3,2,3,2,3,3,2,3,3,2,3,3,2,3,3,2,3,3,3,2,2,3,3,3,3,3,3,3,3,3,3,2,3,3]},
  "valkyrie":{"height":112,"body":252,"neutral":1.04,"pads":[2,3,3,3,4,5,3,3,3,3,4,7,2,3,3,3,4,3,2,2,5,4,5,4,3,3,3,3,4,4,4,4,4,4,5,5,4,5,4,4]},
  "agumon":{"height":90,"body":214,"neutral":1,"pads":[3,3,3,3,4,3,3,2,4,2,3,3,3,5,4,5,3,3,3,3,4,3,4,4,4,4,4,3,3,3,3,4,4,5,3,4,3,4,4,3]},
  "pawapuro":{"height":94,"body":214,"neutral":1,"pads":[3,3,3,3,3,3,3,1,3,3,3,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,3,3,3,4,3,3,3,3,3,4]},
  "headmaster":{"height":100,"body":215,"neutral":1,"pads":[3,3,2,3,2,2,3,3,3,3,3,10,3,2,3,3,3,2,2,3,3,3,3,3,3,3,3,3,3,4,4,4,3,4,3,3,4,4,4,3]},
  "sakuna":{"height":98,"body":215,"neutral":1,"pads":[3,2,3,6,2,3,3,3,3,4,2,2,2,2,3,2,3,3,3,3,3,3,3,3,3,2,2,3,4,3,3,3,3,4,3,3,3,4,3,3]},
  "haseo":{"height":110,"body":223,"neutral":1.06,"pads":[30,28,17,42,10,20,34,15,16,53,42,12,31,14,29,53,44,55,14,11,25,17,27,15,18,17,19,12,21,20,21,13,19,9,19,10,12,8,15,14]},
  "terrarian":{"height":84,"body":175,"neutral":1,"pads":[3,3,3,3,3,3,2,2,2,2,3,3,3,3,2,3,2,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2]},
  "horse":{"height":112,"body":215,"neutral":1,"pads":[2,2,2,3,3,3,2,3,3,3,3,3,2,2,3,3,2,3,3,3,4,3,3,2,3,3,3,3,3,3,3,4,3,3,3,4,4,4,5,3]},
  "chef":{"height":98,"body":214,"neutral":1,"pads":[3,3,3,3,3,3,3,2,3,2,2,3,3,2,3,2,3,3,2,2,3,3,2,2,3,3,3,3,2,3,2,3,3,3,3,3,2,3,3,2]},
  "akira":{"height":110,"body":251,"neutral":1.04,"pads":[3,3,3,3,3,3,3,3,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,3,4,5,4,3,4,4,3,4]},
  "morphie":{"height":100,"body":252,"neutral":1,"pads":[4,4,3,4,3,4,3,4,4,3,3,3,3,3,4,3,3,3,3,4,4,3,4,4,4,4,3,4,4,4,4,4,4,4,3,4,3,4,4,3]},
  "fei":{"height":110,"body":264,"neutral":1,"pads":[3,3,3,2,3,2,3,3,3,2,3,2,3,3,3,3,2,2,3,2,10,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,2]},
  "human":{"height":98,"body":221,"neutral":1,"pads":[2,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,3,3,2,3,2,3,3,3,2,2,2,2,2,3,2,2,2,2,2,3,3,3,3,3]},
  "kitten":{"height":106,"body":268,"neutral":1,"pads":[3,4,4,4,4,4,3,3,3,3,4,4,3,5,3,14,4,4,4,4,3,4,4,3,4,3,4,3,3,4,4,4,4,3,3,4,4,3,3,3]},
  "elma":{"height":110,"body":258,"neutral":1,"pads":[4,4,4,3,3,3,3,3,4,4,3,4,3,3,4,3,3,4,3,7,4,3,4,4,4,3,3,4,4,3,3,4,4,4,4,4,3,4,3,4]},
  "goemon":{"height":94,"body":237,"neutral":1,"pads":[3,3,3,4,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,3,3,4,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,3,4,4]},
  "bayleef":{"height":116,"body":242,"neutral":1,"pads":[3,4,4,3,3,3,4,4,3,3,4,3,4,3,3,4,3,3,3,3,4,3,4,3,4,3,4,4,3,4,3,4,3,3,3,3,4,4,3,3]},
  "metabee":{"height":116,"body":245,"neutral":1,"pads":[3,3,3,3,3,3,4,4,3,3,3,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,3,3,4,3,4,3,3,3,4,3,4]},
  "nier":{"height":108,"body":233,"neutral":1,"pads":[3,4,4,3,3,3,3,3,3,3,4,3,3,4,3,4,3,4,3,5,3,4,3,3,3,3,3,4,4,3,3,4,3,4,3,4,3,8,4,6]},
  "miku":{"height":104,"body":256,"neutral":1,"pads":[4,3,4,3,4,4,3,3,3,3,3,3,3,3,3,4,4,3,4,3,3,4,3,3,4,4,4,4,3,3,3,4,4,4,4,3,4,3,3,3]},
  "naruhodo":{"height":112,"body":265,"neutral":1,"pads":[3,3,3,4,4,4,3,3,3,4,4,4,3,3,3,3,3,4,4,3,4,4,4,3,3,3,3,4,3,4,4,4,4,3,4,3,3,3,4,3]},
  "jibanyan":{"height":78,"body":201,"neutral":1,"pads":[4,4,4,3,3,3,3,3,4,4,3,3,3,3,3,4,3,4,3,4,3,4,3,3,3,3,3,3,3,3,4,3,3,4,3,4,4,3,3,3]},
  "layton":{"height":108,"body":265,"neutral":1,"pads":[3,3,4,3,3,4,4,3,3,4,3,3,4,3,3,3,3,3,4,3,4,4,3,4,3,4,4,3,3,4,4,4,4,3,3,4,3,4,3,3]},
  "dante":{"height":114,"body":261,"neutral":1,"pads":[3,3,4,3,3,3,3,3,4,3,4,4,3,3,3,3,3,3,3,4,3,3,4,3,3,3,4,4,4,4,3,4,3,4,3,4,3,4,4,4]},
  "leon":{"height":112,"body":253,"neutral":1,"pads":[4,3,3,4,3,3,3,3,4,3,3,3,4,3,4,4,4,4,3,3,3,4,3,3,3,3,3,3,4,3,3,3,4,4,4,3,4,3,3,3]},
  "tifa":{"height":108,"body":279,"neutral":1,"pads":[3,3,4,3,4,3,3,3,3,3,3,3,4,3,3,3,3,3,4,4,3,4,4,3,3,3,3,4,4,4,3,4,3,3,4,3,3,4,4,3]},
  "zidane":{"height":100,"body":220,"neutral":1,"pads":[4,4,3,3,3,3,3,3,3,3,3,4,3,4,4,3,5,3,3,3,3,3,3,3,3,4,3,3,4,3,3,3,3,3,4,9,3,3,3,3]},
  "yuffie":{"height":102,"body":223,"neutral":1,"pads":[3,3,4,3,4,3,3,3,3,3,3,4,3,3,4,4,7,4,3,5,3,3,3,3,3,3,3,3,3,3,4,4,6,4,7,3,6,3,3,3]},
  "vincent":{"height":114,"body":239,"neutral":1,"pads":[3,3,4,3,3,3,3,4,3,3,3,4,3,3,3,4,4,3,3,3,3,4,3,4,4,3,3,4,4,3,4,3,3,4,11,4,4,3,3,4]},
  "kiryu":{"height":116,"body":249,"neutral":1,"pads":[3,3,3,3,4,4,3,4,3,4,3,4,3,4,3,3,3,3,3,3,3,3,4,3,3,4,4,3,3,3,4,3,3,4,4,3,4,3,3,4]},
  "crash":{"height":92,"body":222,"neutral":1,"pads":[4,3,3,3,4,3,3,3,3,4,3,4,3,3,3,3,3,3,3,4,3,3,3,4,3,3,3,4,3,4,3,3,4,3,3,4,3,3,4,3]},
  "charlotta":{"height":86,"body":241,"neutral":1,"pads":[3,3,3,3,4,3,3,4,3,4,4,4,3,4,3,3,4,3,4,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,3,5,4,3,3]},
  "ryofu":{"height":122,"body":223,"neutral":1,"pads":[3,3,4,4,6,5,3,4,3,3,3,4,3,4,3,3,4,6,3,3,3,3,3,3,4,4,3,3,3,3,4,3,3,4,4,4,4,7,4,3]},
  "mametchi":{"height":78,"body":231,"neutral":1,"pads":[3,3,4,3,4,3,3,3,4,3,3,3,4,3,3,3,3,3,3,4,4,4,4,3,3,3,3,3,3,4,3,3,3,3,3,3,3,3,3,3]},
  "piposaru":{"height":86,"body":216,"neutral":1,"pads":[3,4,3,4,3,4,4,3,4,3,4,4,3,3,3,3,3,3,3,3,3,3,3,3,4,4,3,4,3,4,4,3,3,4,4,4,3,3,4,4]},
  "twinbee":{"height":82,"body":201,"neutral":1,"pads":[3,4,3,3,3,3,3,3,3,3,3,6,3,3,3,4,3,4,3,3,4,3,3,3,3,4,4,3,4,3,4,4,3,3,3,3,3,3,3,4]},
  "aruru":{"height":94,"body":243,"neutral":1,"pads":[4,3,4,4,4,3,4,3,3,3,3,3,3,3,3,4,3,3,3,4,3,4,3,3,3,4,3,3,3,4,4,4,3,3,4,3,3,3,3,4]},
  "maruku":{"height":86,"body":176,"neutral":1,"pads":[3,3,3,3,3,3,3,3,3,3,4,4,3,3,3,3,3,3,4,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,3,3,3,3,3,3]},
  "dietrich":{"height":110,"body":324,"neutral":1,"pads":[3,4,4,4,5,4,4,4,3,3,3,5,5,7,5,5,3,5,5,8,4,3,6,4,4,4,3,4,4,5,7,4,5,5,5,3,3,3,6,7]},
  "edf":{"height":114,"body":338,"neutral":1,"pads":[3,3,3,4,3,3,3,4,3,4,3,4,3,3,4,3,3,4,3,3,3,3,3,3,3,4,3,3,3,3,3,3,4,4,4,3,4,4,4,3]},
  "edelgard":{"height":110,"body":299,"neutral":1,"pads":[10,47,45,35,35,57,53,57,8,27,7,18,9,18,50,10,15,7,41,37,6,32,12,13,14,9,11,6,16,7,7,13,51,38,38,29,11,14,3,9]},
  "guile":{"height":116,"body":271,"neutral":1,"pads":[3,3,3,3,3,3,3,3,3,3,3,3,3,4,3,4,3,3,4,3,3,3,4,4,4,3,4,4,4,3,3,4,3,3,3,4,3,4,4,4]},
  "sukapon":{"height":90,"body":245,"neutral":1,"pads":[4,4,4,3,3,3,4,3,4,3,3,3,4,4,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,3,3,4,3,3,3,3,3,4,3,4]},
  "pneuma":{"height":112,"body":346,"neutral":1,"pads":[3,4,5,4,5,4,4,3,4,4,3,3,3,10,4,4,12,5,3,4,3,9,8,6,4,3,4,7,4,4,4,3,4,4,4,4,3,3,3,6]},
  "arus":{"height":94,"body":240,"neutral":1,"pads":[3,4,3,3,3,3,4,4,4,3,3,4,3,3,3,3,5,3,4,4,3,3,3,3,3,3,3,3,4,3,3,3,3,4,4,3,4,4,4,4]},
  "knight":{"height":72,"body":210,"neutral":1,"pads":[3,3,3,4,4,4,4,4,3,4,3,4,3,3,4,4,5,3,4,4,3,3,4,4,3,4,4,3,3,4,4,4,4,3,4,3,3,3,3,4]},
  "maelle":{"height":108,"body":206,"neutral":1,"pads":[3,4,3,4,4,4,3,3,3,4,4,6,5,26,4,4,23,4,4,4,4,3,4,3,3,4,3,4,3,4,4,4,3,4,3,9,3,6,11,3]},
  "sumino":{"height":106,"body":200,"neutral":1,"pads":[3,4,3,4,4,4,3,4,4,4,3,4,4,3,4,3,7,3,3,3,3,4,4,3,3,3,3,3,4,4,3,3,3,3,6,3,3,4,6,3]},
  "rocbouquet":{"height":108,"body":216,"neutral":1,"pads":[4,3,4,4,5,3,3,4,3,4,3,4,5,17,4,3,16,4,4,4,3,3,4,3,3,4,3,4,5,4,5,3,4,5,4,5,4,4,3,4]},
  "frog":{"height":86,"body":174,"neutral":1,"pads":[3,3,3,3,3,4,3,3,4,3,3,3,3,4,3,4,4,3,3,4,3,4,3,4,3,3,3,3,3,3,3,4,4,4,4,3,3,3,3,3]},
  "tressa":{"height":98,"body":204,"neutral":1,"pads":[3,4,3,3,3,4,4,3,4,4,3,3,3,3,3,3,4,3,4,3,3,3,4,3,3,3,3,3,4,4,3,3,3,4,4,3,3,4,4,3]},
  "eve":{"height":110,"body":527,"neutral":1,"pads":[3,3,3,3,4,4,4,3,3,3,3,4,3,4,4,3,5,3,3,3,3,4,3,3,3,3,4,4,3,4,3,4,4,4,3,4,3,3,3,3]},
  "odio":{"height":116,"body":219,"neutral":1,"pads":[4,7,4,3,6,3,3,4,3,3,3,3,5,4,11,3,5,3,3,3,4,5,4,3,3,3,3,3,3,4,4,6,3,4,6,7,3,3,4,7]},
  "laharl":{"height":90,"body":225,"neutral":1,"pads":[4,3,4,4,3,3,3,3,3,3,3,4,4,4,3,3,5,4,3,3,4,4,3,3,3,3,3,4,3,3,3,3,4,4,3,3,3,3,3,3]},
  "deemo":{"height":128,"body":249,"neutral":1,"pads":[3,3,5,4,7,3,3,3,3,4,3,5,5,3,3,5,6,3,3,3,3,3,7,3,3,3,3,4,3,3,3,4,4,4,3,5,3,4,4,3]},
  "kasane":{"height":108,"body":251,"neutral":1,"pads":[3,4,4,4,4,4,3,3,3,4,3,3,3,3,10,4,9,3,3,3,3,3,3,3,4,4,3,3,3,4,3,3,3,4,8,4,3,4,3,4]},
  "shadow":{"height":86,"body":237,"neutral":1,"pads":[3,3,3,4,3,3,3,3,3,3,4,3,3,3,4,3,3,3,3,4,4,3,3,3,3,3,3,4,3,3,3,3,3,3,4,3,3,3,3,3]},
  "saki":{"height":100,"body":240,"neutral":1,"pads":[3,3,3,4,3,3,4,3,3,3,4,4,3,3,3,3,6,3,3,3,4,4,3,3,3,3,3,3,3,3,3,4,3,3,3,4,3,3,3,3]},
  "aerith":{"height":108,"body":244,"neutral":1,"pads":[4,3,3,4,4,3,3,3,3,3,4,4,3,3,3,3,3,3,3,3,3,5,4,3,3,3,4,4,4,3,3,3,3,3,4,4,4,3,3,3]},
  "doshin":{"height":144,"body":239,"neutral":1,"pads":[4,3,3,3,3,3,4,4,3,3,6,4,3,4,3,4,3,4,3,4,3,4,4,4,3,3,3,3,3,3,3,3,3,4,4,4,3,3,3,3]},
  "moogle":{"height":82,"body":247,"neutral":1,"pads":[3,3,3,3,3,3,3,4,3,3,3,3,3,3,3,3,4,3,3,3,4,4,4,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,4,3]},
  "greymon":{"height":130,"body":235,"neutral":1,"pads":[4,4,5,4,5,4,4,5,4,4,3,3,3,4,3,4,4,4,4,4,4,4,4,3,4,4,4,3,4,3,3,4,4,4,4,3,4,4,4,4]},
  "metalgreymon":{"height":140,"body":249,"neutral":1,"pads":[4,4,4,4,3,4,4,3,4,4,3,4,10,6,3,5,5,4,3,4,3,7,3,4,3,4,4,4,3,4,3,3,3,4,4,3,3,4,3,5]},
  "wargreymon":{"height":136,"body":230,"neutral":1,"pads":[4,4,4,4,6,4,4,3,4,4,4,4,4,4,3,5,6,4,4,5,4,3,4,3,4,4,3,4,6,4,4,3,3,5,4,4,4,3,4,4]},
  "omegamon":{"height":146,"body":186,"neutral":1,"pads":[4,3,4,3,4,4,4,4,4,4,3,3,4,4,4,3,6,4,3,4,5,6,3,4,3,3,3,4,5,3,3,4,4,3,3,4,4,4,4,4]},
  "donchan":{"height":86,"body":160,"neutral":1,"pads":[3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,3,3,3,4,3,3,3,3,3,3,3,3,4,3,4,4,4,3,3,3,4,3]},
  "shizuna":{"height":110,"body":244,"neutral":1,"pads":[20,32,29,47,51,55,41,26,13,27,26,43,51,10,27,22,28,14,20,19,20,30,26,15,29,23,35,15,14,10,34,18,45,27,23,30,39,23,10,44]},
  "hanajs":{"height":88,"body":161,"neutral":1,"pads":[16,13,15,9,11,24,13,18,21,11,12,39,36,7,18,12,15,12,19,13,13,22,47,17,21,10,25,18,15,12,29,8,25,10,33,12,38,26,17,13]},
  "hanajk":{"height":104,"body":127,"neutral":1.03,"pads":[15,19,14,20,12,22,17,18,20,14,23,11,17,18,26,20,13,11,18,17,21,24,42,16,20,53,19,15,21,10,21,25,28,8,23,28,32,35,31,21]},
  "hanajd":{"height":112,"body":210,"neutral":1.03,"pads":[11,19,15,32,8,17,12,18,20,29,17,27,33,8,17,12,17,16,21,14,17,27,32,15,15,19,13,11,13,23,18,10,29,8,13,32,33,54,9,23]},
  "kisuke":{"height":98,"body":218,"neutral":1.06,"pads":[21,40,59,52,19,15,32,20,33,26,24,63,48,9,33,25,18,45,26,26,20,18,11,19,19,31,46,25,22,23,34,35,37,11,11,9,44,50,13,8]}
 };
 // Display-only tuning preserves the approved pose, aspect ratio and foot/hand
 // anchors. Keep the authored differences within each size group.
 const displayScale=Object.fromEntries([
  ...['pneuma','rex','maruku','isaac','kasane','maelle','edf','naruhodo','leon','guile','shiren','metabee','horse','sakuna'].map(id=>[id,.94]),
  ...['dragoon','zidane','terry','tressa','midna','agumon','pokoa'].map(id=>[id,.88]),
  ['yuffie',.92]
 ]);
 const heights=Object.fromEntries(Object.entries(calibration).map(([id,c])=>[id,c.height*(displayScale[id]??1)]));
 function baseNative(id,n){return sourceNative(id,n)*(n===0?calibration[id]?.neutral||1:1);}
 function native(id,n){return baseNative(id,n)*(MotionSize.characters[id]?.scale[n]??1)*(id==='yuffie'&&n>=28&&n<=31?.94:1);}
 function imagePose(f,n){if(f.characterId==='zero')return n===18?44:n===0&&f.zeroCatchUntil>frame?46:n;if(f.characterId==='vivi')return n===22?21:n===21?20:n;return n;}
 function art(id){const c=calibration[id];return c?heights[id]/(c.body*native(id,0)*FIGHTER_SCALE):1;}
 function baseline(f,n){
  // Ledge art is positioned by its hand anchor, not by its lowest opaque pixel.
  if(['LedgeCatch','LedgeHang'].includes(f.mode))return 0;
  if(f.characterId==='haseo')return haseoArtBaseline(f,n);
  if(f.characterId==='edelgard')return edelgardArtBaseline(f,n);
  return MotionSize.characters[f.characterId]?.pad[n]??calibration[f.characterId]?.pads[n]??0;
 }
 function geometry(f){const id=f.characterId,img=characterArt[id]?.frames[0];return geometryIds.has(id)&&img?physicsHeights[id]/(img.height*sourceNative(id,0)*FIGHTER_SCALE):1;}
 function originY(f){return f.characterId==='kitten'?kittenDrawOriginY(f):f.y;}
 function point(f,p){const s=geometry(f),y=originY(f);return{x:f.x+(p.x-f.x)*s,y:y+(p.y-y)*s};}
 function prepare(f){const s=geometry(f),c=f.character;c.ecb={radius:c.ecb.radius*s,height:Math.min(c.ecb.height*s,physicsHeights[f.characterId]||Infinity,displayScale[f.characterId]?heights[f.characterId]:Infinity)};c.shieldSize*=s;c.shieldOffset=c.shieldOffset.map(v=>v*s);}
 return{heights,native,baseNative,imagePose,art,baseline,geometry,originY,point,prepare};
})();
