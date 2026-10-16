'use strict';
let burstEffects=[];
// Feet are the movement anchor; use the body's center at the upper blast line.
function blastZoneSide(f){const z=StageRules.blast;if(f.y-f.character.ecb.height/2<z.top&&(f.tumbling||f.hitstun>0||f.pendingLaunch))return'top';if(f.y>z.bottom)return'bottom';if(f.x<z.left)return'left';if(f.x>z.right)return'right';return null;}
function addBurstEffect(f){const side=blastZoneSide(f)||'top',vertical=side==='top'||side==='bottom',sx=W/2+(f.x-camera.x)*camera.z,sy=H*.47+(f.y-42-camera.y)*camera.z;burstEffects.push({side,x:vertical?clamp(sx,110,W-110):side==='left'?0:W,y:vertical?(side==='top'?0:H):clamp(sy,120,H-120),angle:side==='top'?Math.PI/2:side==='bottom'?-Math.PI/2:side==='left'?0:Math.PI,life:38,color:colors[f.color]});}
function drawBurstEffects(){for(const b of burstEffects){const progress=1-b.life/38,alpha=Math.min(1,b.life/14),length=380+progress*200,width=(1-progress)*110;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=alpha;let glow=ctx.createLinearGradient(0,0,length,0);glow.addColorStop(0,'#fff');glow.addColorStop(.22,b.color);glow.addColorStop(1,b.color+'00');path([[0,-width],[length,0],[0,width]],glow);for(let n=0;n<9;n++){let offset=(n-4)*23,reach=length*(.65+.35*Math.sin(n*4.7));line([[0,offset],[reach,offset*(1+progress)]],n%2?'#fff':b.color,Math.max(1,(1-progress)*(n%2?3:6)));}ctx.globalAlpha=alpha*.7;ctx.strokeStyle='#fff';ctx.lineWidth=5*(1-progress)+1;ctx.beginPath();ctx.ellipse(0,0,50+progress*230,90+progress*200,0,0,TAU);ctx.stroke();ctx.restore();}}
// Positions are world coordinates; the loupe is drawn in the fixed screen viewport.
// Measured hand positions relative to the drawn body anchor, in source coordinates.
// Negative horizontal offsets are mirrored for both ledges; facing stays logical.
const LedgeArtData={katamari:[0.21851891833540238,0.9670781893004116],klonoa:[0.144156553812527,0.950381679389313],hayabusa:[0.019146238377007685,0.9627329192546584],malenia:[0.2043759001076142,0.965034965034965],c4621:[0.383286449763813,0.966996699669967],toro:[0.15,0.99],hornet:[0.08,0.99],yuri:[-0.04,0.97],krystal:[0.08,0.95],fiora:[.18,.99],melia:[.08,.95],megamanexe:[.13,.95],cojicoji:[.16,.95],hinako:[0,.97],ray:[0,.90],alain:[0,.90],kisuke:[-0.14179841897233203,0.9578947368421052],hanajd:[0.052487610978177,0.9469387755102041],hanajk:[0.10460225907233844,0.9736842105263158],hanajs:[0.2724956958645164,0.9666666666666667],shizuna:[0.025172231054583993,0.9695945945945946],donchan:[-0.03557708957708955,0.9881889763779528],omegamon:[-0.061413637672999566,0.9875],wargreymon:[0.1334900332225913,0.9898648648648649],metalgreymon:[0.13722337759291858,0.9886792452830189],greymon:[0.02085910979981609,0.987012987012987],moogle:[0.26345846320639654,0.84],doshin:[0.050782933828695254,0.9886363636363636],aerith:[0.10583833833833833,0.9901315789473685],saki:[-0.03532288711663012,0.9897610921501706],shadow:[-0.19147141631789716,0.9887218045112782],kasane:[-0.3045650692709517,0.9863013698630136],deemo:[-0.013742236024844756,0.9834254143646409],laharl:[-0.05809257252919231,0.9846938775510204],odio:[0.1553785688768073,0.9863013698630136],eve:[0.16409937888198756,0.9852941176470589],tressa:[0.14361484669176972,0.9846153846153847],frog:[0.1038,0.9866071428571429],rocbouquet:[0.4086363636363636,0.9863013698630136],sumino:[0.3104707884288146,0.9888888888888889],maelle:[0.0634103551561831,0.9878542510121457],knight:[0.3419898283534647,0.988],arus:[0.33649698015530627,0.9909365558912386],pneuma:[0.4826201201201201,0.9901960784313726],sukapon:[0.33275784174519174,0.9893238434163701],guile:[0.5005551882147767,0.991869918699187],edelgard:[0.1004246647784951,0.963777285669092],edf:[0.23634020629532493,0.9885931558935361],dietrich:[0.2478493597274436,0.9902912621359223],maruku:[-0.23371172164684817,0.9886792452830189],aruru:[0.1156875800256083,0.9896907216494846],twinbee:[-0.1405562468889995,0.9893238434163701],piposaru:[-0.17389878899843125,0.9898648648648649],mametchi:[-0.22676160540039036,0.9882352941176471],ryofu:[-0.13653975504274862,0.9909365558912386],charlotta:[0.045145870030662616,0.9903536977491961],crash:[-0.05186206822172032,0.9909638554216867],kiryu:[-0.27775495540777395,0.9921671018276762],vincent:[-0.4690387400202479,0.9902912621359223],yuffie:[0.08581063529173238,0.9904761904761905],zidane:[-0.09026589521017842,0.9917355371900827],tifa:[-0.016696902609515618,0.9911764705882353],leon:[-0.3319643967189827,0.9909638554216867],dante:[0.013791999654723441,0.9912023460410557],
 dragoon:[0.0925253,0.9821410],
 isaac:[0.3175416,0.9830250],
 ulgrim:[0.0720678,0.9817978],
 chiikawa:[-0.2820724,0.9802083],
 chocobo:[0.1903986,0.9816346],
 monokuma:[0.3457884,0.9799564],
 riki:[0.3305463,0.9809209],
 roxas:[0.0914659,0.9796848],
 twob:[0.1299213,0.9832697],
 okami:[0.1766369,0.9798834],
 gundam:[-0.3579623,0.9804688],
 vivi:[0.2485649,0.9811749],
 zero:[0.1379762,0.9823882],
 rin:[-0.0311657,0.9812602],
 nia:[-0.0416667,0.9835069],
 lightning:[0.2006687,0.9836411],
 colette:[0.1476130,0.9827390],
 rean:[0.22670807453416153,0.9715447154471545],
 estelle:[0.0499035,0.9833417],
 noctis:[-0.1953492,0.9823159],
 clive:[0.1775256,0.9857444],
 makoto:[-0.2211321,0.9817358],
 neku:[-0.1851013,0.9821933],
 narukami:[0.4168136,0.9819082],
 naegi:[-0.1169034,0.9826746],
 rex:[0.0438224,0.9851954],
 luke:[0.0522727,0.9821778],
 will:[-0.1961397,0.9810284],
 kosmos:[-0.2076503,0.9815574],
 fayt:[0.1031746,0.9824686],
 emma:[0.3479442,0.9834944],
 ryza:[0.2235043,0.9814665],
 noah:[0.0915493,0.9825216],
 midna:[0.3545082,0.9806743],
 bomberman:[0.3091603,0.9816253],
 sans:[0.1022288,0.9815956],
 lloyd:[0.1135244,0.9811267],
 shiren:[-0.2117965,0.9837500],
 pokoa:[-0.0431433,0.9810441],
 hunter:[0.2742786,0.9829463],
 adol:[0.1504499,0.9821573],
 terry:[0.2032933,0.9807097],
 valkyrie:[0.1846197,0.9812601],
 agumon:[0.2880284008087648,0.9676820728291317],
 pawapuro:[0.3083548,0.9830737],
 headmaster:[0.1462585,0.9823611],
 sakuna:[-0.0976016,0.9806094],
 haseo:[-0.02276218314587075,0.972243627741553],
 terrarian:[-0.1648865,0.9821580],
 horse:[0.0129396,0.9817273],
 chef:[0.2291879,0.9833398],
 akira:[0.2815222,0.9804725],
 morphie:[0.0536632,0.9803850],
 fei:[0.0137391,0.9825191],
 human:[-0.0019451,0.9813814],
 kitten:[0.1495333,0.9802429],
 elma:[0.0315344,0.9809801],
 goemon:[-0.1328810,0.9793375],
 bayleef:[0.0690457,0.9810855],
 metabee:[0.0442737,0.9822214],
 nier:[-0.4547376,0.9806318],
 miku:[-0.1337925,0.9810460],
 naruhodo:[-0.3581026,0.9796858],
 jibanyan:[0.1198290,0.9803602],layton:[-0.12528044871794874,0.9897959183673469]
};
// All native hang poses were reviewed in .tools/ledge-source-review-*.png.
// Facing is independent of which raised hand is left/right of the feet anchor.
// Agumon's hanging pose looks left; all other directional poses look right.
const LedgeArtFacing=Object.fromEntries(Object.keys(LedgeArtData).map(id=>[id,id==='agumon'?-1:1]));
function ledgeArt(f){const grip=f.characterId==='malenia'&&maleniaRot(f)?MaleniaArtRects.rotGrip:LedgeArtData[f.characterId]||[.17,.965];return{grip,flip:LedgeArtFacing[f.characterId]===-1};}
function ledgeHangPosition(f,ledge){
 const n=pose({...f,state:'ledge',mode:'LedgeHang',attack:null}),sprite=spriteFor(f,n),scale=BattleSize.native(f.characterId,BattleSize.imagePose(f,n))*FIGHTER_SCALE*BattleSize.art(f.characterId);
 const width=(sprite?.width||132)*scale,height=(sprite?.height||213)*scale,{grip}=ledgeArt(f);
 return{x:ledge.x-ledge.face*width*Math.abs(grip[0]),y:ledge.y+height*grip[1]};
}
function ledgeSpriteOffset(f,n,img){if(!['LedgeCatch','LedgeHang'].includes(f.mode))return 0;const{grip,flip}=ledgeArt(f),width=img.width*BattleSize.native(f.characterId,BattleSize.imagePose(f,n))*FIGHTER_SCALE*BattleSize.art(f.characterId);return f.face*width*(Math.abs(grip[0])-grip[0]*(flip?-1:1));}
function resolveFighterBodies(previous){
 
 const skip=f=>f.attack?.bodyPassFrames&&CombatSystem.inWindow(f.attack.bodyPassFrames,f.timer)||!f.grounded||f.respawn||f.hitlag||f.hitstun||f.grabbed||['SpotDodge','ForwardRoll','BackwardRoll','TechRoll','GetupRoll','LedgeRoll','Grabbed','Pummel','GrabHold','LedgeCatch','LedgeHang'].includes(f.mode);
 for(let i=0;i<fighters.length;i++)for(let j=i+1;j<fighters.length;j++){const a=fighters[i],b=fighters[j];if(skip(a)||skip(b)||Math.abs(a.y-b.y)>12)continue;
 const direction=Math.sign(previous[j].x-previous[i].x)||Math.sign(b.x-a.x)||1;
 const gap=(b.x-a.x)*direction,spacing=a.character.ecb.radius+b.character.ecb.radius;
 if(gap>=spacing)continue;
 const center=(a.x+b.x)/2;
 a.x=center-direction*spacing/2;b.x=center+direction*spacing/2;
 // Remove velocity into the opponent. Momentum cannot tunnel through a body.
 if(a.vx*direction>0)a.vx=0;if(b.vx*direction<0)b.vx=0;}
 // Only grounded fighters can lose support after being pushed. Airborne
 // velocity belongs to physics, including jumps, falling and knockback.
 for(const f of fighters){if(!f.grounded)continue;const floor=platforms.find(p=>Math.abs(p.y-f.y)<2&&f.x>p.x-9&&f.x<p.x+p.w+9);if(!floor){f.grounded=false;f.vy=0;}}
}
function battleViewBounds(){const z=StageRules.blast,d=StageRules.loupe.warningDistance;return{left:z.left+d,right:z.right-d,top:z.top+d,bottom:z.bottom-d};}
function blastEdgeDistances(f){const z=StageRules.blast,h=f.character?.ecb.height??CharacterData[f.characterId]?.ecb.height??BODY_HEIGHT;return[{side:'left',distance:f.x-z.left,v:-f.vx},{side:'right',distance:z.right-f.x,v:f.vx},{side:'top',distance:f.y-h/2-z.top,v:-f.vy},{side:'bottom',distance:z.bottom-f.y,v:f.vy}];}
function blastWarningSide(f){return blastEdgeDistances(f).sort((a,b)=>a.distance-b.distance).find(e=>e.distance<=StageRules.loupe.warningDistance)?.side||null;}
// Screen visibility includes the HUD area. Damage panels must not shorten the
// playable viewport or turn an on-screen fighter into an off-screen indicator.
function fighterScreenBody(f){
 const id=f.characterId,h=Math.max(f.character?.ecb.height??CharacterData[id]?.ecb.height??BODY_HEIGHT,(BattleSize.heights[id]??0)*MorphieRules.scale(f));
 const radius=Math.max(f.character?.ecb.radius??CharacterData[id]?.ecb.radius??18,h*.3);
 const x=W/2+(f.x-camera.x)*camera.z,y=H*.47+(BattleSize.originY(f)-camera.y)*camera.z;
 return{left:x-radius*camera.z,right:x+radius*camera.z,top:y-h*camera.z,bottom:y};
}
function fighterOutsideViewport(f){const b=fighterScreenBody(f);return b.right<=0||b.left>=W||b.bottom<=0||b.top>=H;}
function battleWorldHidden(f){return!!blastWarningSide(f)&&fighterOutsideViewport(f);}
function battleHudOpacity(x,y){
 // Fade any player's whole panel when any live body overlaps it, including
 // portraits and character-specific gauges. This is presentation only.
 return fighters.some(f=>{if(f.respawn||BattlePlayers.out(f)||fighterOutsideViewport(f))return false;const b=fighterScreenBody(f);return b.right>x-55&&b.left<x+262&&b.bottom>y-32&&b.top<Math.min(H,y+112);})?.14:1;
}
function loupePosition(f){
 if(f.respawn||BattlePlayers.out(f)||!fighterOutsideViewport(f))return null;
 const p={x:W/2+(f.x-camera.x)*camera.z,y:H*.47+(f.y-42-camera.y)*camera.z};
 const launched=!!(f.tumbling||f.hitstun>0||f.pendingLaunch),edges=blastEdgeDistances(f);
 // A fast uninterrupted launch may burst directly; voluntary movement always warns.
 if(launched&&edges.some(e=>e.v>0&&e.distance/e.v<=8))return null;
 const near=edges.sort((a,b)=>a.distance-b.distance).find(e=>e.distance<=StageRules.loupe.warningDistance);
 const inset=StageRules.loupe.inset,r=StageRules.loupe.radius,left=inset,right=W-inset,top=Math.max(inset,matchClockTop+r+18),bottom=H-165;
 const cx=W/2,cy=(top+bottom)/2,dx=p.x-cx,dy=p.y-cy;
 const t=Math.min((right-cx)/Math.max(.001,Math.abs(dx)),(bottom-cy)/Math.max(.001,Math.abs(dy)));
 let q=near?{x:clamp(p.x,left,right),y:clamp(p.y,top,bottom)}:{x:cx+dx*t,y:cy+dy*t};
 if(near){if(near.side==='left')q.x=left;if(near.side==='right')q.x=right;if(near.side==='top')q.y=top;if(near.side==='bottom')q.y=bottom;}
 // Keep the fixed clock clear while loupes render above the rest of the HUD.
 if(!training&&Number.isFinite(matchTime)&&q.y-r<matchClockTop+90&&q.x+r>W-266)q.x=W-266-r-12;
 return{...q,angle:near?{left:Math.PI,right:0,top:-Math.PI/2,bottom:Math.PI/2}[near.side]:Math.atan2(dy,dx),side:near?.side||null};
}
function drawOffscreenLoupes(){
 for(const f of fighters){if(f.respawn)continue;const p=loupePosition(f);if(!p)continue;
  const r=StageRules.loupe.radius,col=colors[f.color];ctx.save();ctx.translate(p.x,p.y);
  ctx.shadowColor=col;ctx.shadowBlur=16;ctx.fillStyle='#071329ef';ctx.strokeStyle=col;ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
  ctx.save();ctx.beginPath();ctx.arc(0,0,r-3,0,TAU);ctx.clip();
  drawSprite({...f,x:0,y:39,inv:0},1,null,.92);ctx.restore();
  ctx.save();ctx.rotate(p.angle);path([[r+5,-6],[r+15,0],[r+5,6]],col);ctx.restore();
  text(playerLabel(f.id)+' '+Math.floor(f.damage)+'%',0,-r-8,12,col);ctx.restore();
 }
}
