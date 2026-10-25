'use strict';
const PresentationTiming=Object.freeze({introFrames:240,introCountFrames:180,finishHoldSeconds:.85,victoryRevealSeconds:3});
// Presentation reads the match; its clock and textures never change simulation.
const BattlePresentation=(()=>{
 let atlas=null,pending=null,ending=null,introTotal=PresentationTiming.introFrames,introQueue=[],introStep=90;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const ease=v=>1-Math.pow(1-clamp(v,0,1),3);
 function load(){return pending??=new Promise(resolve=>{const im=new Image();im.onload=()=>{atlas=im;resolve();};im.onerror=()=>resolve();im.src='assets/presentation/cinematic-atlas.png';});}
 function stamp(n,x,y,w,h,alpha=1){if(!atlas)return;ctx.save();ctx.globalAlpha*=clamp(alpha,0,1);const sw=atlas.width/2,sh=atlas.height/2;
  // The blue artwork crosses the atlas midpoint into the gold cells. Exclude
  // that shared gutter while preserving the gold artwork's scale and position.
  const inset=n===1||n===3?Math.ceil(sw*.12):0,dx=w*inset/sw;
  ctx.drawImage(atlas,n%2*sw+inset,(n/2|0)*sh,sw-inset,sh,x-w/2+dx,y-h/2,w-dx,h);ctx.restore();}
 const name=f=>Roster.definitions.find(d=>d.id===f.characterId)?.name||f.characterId;
 function portrait(f,x,y,w,h){const im=ArtLoader.hudPortrait(f.characterId,f.color);if(!im)return;const k=Math.max(w/im.width,h/im.height);ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(im,x+(w-im.width*k)/2,y+h-im.height*k,im.width*k,im.height*k);ctx.restore();}
 function begin(){introQueue=[];if(fighters.some(f=>f.squad))for(let member=0;member<Math.max(...fighters.map(f=>f.squad?.length||1));member++)for(const f of fighters){const id=f.squad?.[member];if(id)introQueue.push({...f,characterId:id,introMember:member});}introStep=introQueue.length<=6?90:60;introTotal=introQueue.length?introQueue.length*introStep+PresentationTiming.introCountFrames:PresentationTiming.introFrames;if(!training)GameAudio.cinematic('intro');ending=null;$('#result').classList.remove('presentation-pending','presentation-result');}
 function finish(winner){GameAudio.cinematic('victory');const winners=winner<0?[]:fighters.filter(f=>BattlePlayers.teamBattle?f.team===winner:f.id===winner);ending={at:performance.now(),winner,winners:winners.map(f=>({...f})),label:winner<0?'DRAW':BattlePlayers.winnerLabel(winner)};$('#result').classList.add('presentation-pending','presentation-result');}
 function intro(){if(countdown<=0&&fightBannerFrames<=0)return;
  const t=introTotal-countdown,exit=ease((t-(introTotal-55))/55),alpha=countdown>0?1-exit:0,squad=introQueue.length>0;
  if(countdown>0){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#040916ed';ctx.fillRect(0,0,W,H);const shown=squad?[introQueue[Math.min(introQueue.length-1,Math.floor(t/introStep))]]:fighters,n=shown.length,pw=(W-120)/n;
   shown.forEach((f,j)=>{const local=squad?t-Math.min(introQueue.length-1,Math.floor(t/introStep))*introStep:t-j*6,enter=reduced?1:ease(local/23),x=60+j*pw+(1-enter)*(j%2?-W:W),y=120;ctx.save();ctx.beginPath();ctx.moveTo(x+35,y);ctx.lineTo(x+pw,y);ctx.lineTo(x+pw-35,660);ctx.lineTo(x,660);ctx.closePath();ctx.clip();const col=BattlePlayers.color(f),g=ctx.createLinearGradient(x,y,x+pw,660);g.addColorStop(0,col+'77');g.addColorStop(1,'#101827');ctx.fillStyle=g;ctx.fillRect(x,y,pw,540);stamp(2,x+pw/2,405,pw*2,620,.7);if(squad){portrait(f,x+pw*.12,120,pw*.46,540);text(playerLabel(f.id),x+pw*.73,290,30,col);ctx.textAlign='center';ctx.font='900 44px sans-serif';ctx.fillStyle='#fff';ctx.fillText(name(f),x+pw*.73,365,pw*.44);text((f.introMember+1)+'人目 / '+f.squad.length+' FIGHTERS',x+pw*.73,419,17,'#bcd9ee');}else{portrait(f,x-35,130,pw+70,490);ctx.fillStyle='#030912d9';ctx.fillRect(x,575,pw,85);text(playerLabel(f.id),x+pw/2,601,14,col);ctx.font='900 '+(n>2?22:32)+'px sans-serif';ctx.textAlign='center';ctx.fillStyle='white';ctx.fillText(name(f),x+pw/2,638,pw-30);}ctx.restore();});
   stamp(0,W/2,406,W*1.2,125,Math.max(0,1-(t%60)/16));text('BATTLE / '+StageCatalog.name(activeStage),W/2,78,14,'#c1d8ef');text('READY',W/2,739,29,'#a5e8ff');text(countdown>PresentationTiming.introCountFrames?'VS':String(Math.max(1,Math.ceil(countdown/60))),W/2+110,742,44,'#fff');ctx.restore();
  }else{const p=(32-fightBannerFrames)/32;ctx.save();ctx.globalAlpha=1-ease((p-.45)/.55);const s=reduced?1:1.25-ease(p*3)*.25;ctx.translate(W/2,H*.46);ctx.scale(s,s);stamp(2,0,0,1100,280);stamp(0,0,0,1450,170,.9);ctx.font='italic 900 122px Arial';ctx.textAlign='center';ctx.strokeStyle='#06101c';ctx.lineWidth=10;ctx.strokeText('FIGHT!',0,42);ctx.fillStyle='#fff';ctx.fillText('FIGHT!',0,42);ctx.restore();}
 }
 function finale(now=performance.now()){
  if(state!=='result'||!ending)return;const t=(now-ending.at)/1000,p=reduced?1:ease((t-(PresentationTiming.finishHoldSeconds-.05))/.75);ctx.save();
  ctx.globalAlpha=Math.min(1,t*4);ctx.fillStyle='#050b17';ctx.fillRect(0,0,W,H);
  if(t<PresentationTiming.finishHoldSeconds&&!reduced){stamp(2,W/2,H/2,W*1.3,600);stamp(0,W/2,H/2,W*1.5,200);ctx.font='italic 900 112px Arial';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('FINISH!',W/2,H/2+40);ctx.restore();return;}
  const winners=ending.winners,heroX=W*.31;ctx.globalAlpha=p;const glow=ctx.createRadialGradient(heroX,H*.45,20,heroX,H*.45,680);glow.addColorStop(0,'#5b471f');glow.addColorStop(1,'#050b17');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);stamp(1,heroX,H*.44,1000,790,.7);stamp(3,heroX,H*.48,720,650,.38);
  const area=winners.length>1?740:800,start=heroX-area/2,part=area/Math.max(1,winners.length);winners.forEach((f,j)=>{const drift=reduced?0:(1-p)*180;portrait(f,start+j*part+drift,75,part,660);});
  ctx.fillStyle='#050b17b8';ctx.fillRect(0,617,Math.min(W*.61,900),193);stamp(2,heroX,663,930,240,.95);ctx.font='italic 900 78px Arial';ctx.textAlign='center';ctx.fillStyle='#ffdc8e';ctx.fillText(winners.length?'VICTORY':'DRAW',heroX,682);ctx.fillStyle='#050b17f2';ctx.fillRect(30,708,820,48);ctx.font='900 31px sans-serif';ctx.fillStyle='#fff';ctx.fillText(winners.map(name).join(' ＆ ')||'引き分け',heroX,738,760);text(ending.label,heroX,774,14,'#ffe8af');
  if(!reduced&&t<4){for(let n=0;n<28;n++){const x=(n*173.71+t*22)%W,y=(n*81.39+t*(45+n%5*7))%H;ctx.save();ctx.translate(x,y);ctx.rotate(n+t*1.2);ctx.fillStyle=n%3?'#d5ae60':'#fff3bf';ctx.fillRect(-2,-5,4,10);ctx.restore();}}
  ctx.restore();if(t>=PresentationTiming.victoryRevealSeconds||reduced)$('#result').classList.remove('presentation-pending');
 }
 return{load,begin,finish,intro,finale,get introFrames(){return introTotal;},get diagnostics(){return{loaded:!!atlas,introFrames:introTotal,introduced:introQueue.length&&countdown>0?[introQueue[Math.min(introQueue.length-1,Math.floor((introTotal-countdown)/introStep))]?.characterId]:fighters.map(f=>f.characterId),ending:ending&&{winner:ending.winner,characters:ending.winners.map(f=>f.characterId),at:ending.at}}}};
})();
