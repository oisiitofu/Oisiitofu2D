const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.click('#enter-training');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#start');
  const result=await page.evaluate(()=>{
   state='pause';frame=0;const failures=[];let checks=0;
   const check=(name,ok)=>{checks++;if(!ok)failures.push(name);},near=(a,b)=>Math.abs(a-b)<.001;
   const originalDraw=ctx.drawImage,originalArt=BattleSize.art;let draws=[];
   ctx.drawImage=function(img,...args){const m=ctx.getTransform();if(args.length===4)draws.push({img,width:args[2]*Math.hypot(m.a,m.b),height:args[3]*Math.hypot(m.c,m.d),dx:args[0],dy:args[1],w:args[2],h:args[3],m});};
   const opaque=new WeakMap(),body=img=>{if(opaque.has(img))return opaque.get(img);const d=img.getContext('2d').getImageData(0,0,img.width,img.height).data;let top=img.height,bottom=0;for(let y=0;y<img.height;y++){let count=0;for(let x=0;x<img.width;x++)if(d[(y*img.width+x)*4+3]>150)count++;if(count>=Math.max(3,img.width*.012)){top=Math.min(top,y);bottom=y+1;}}const result={top,bottom,height:bottom-top};opaque.set(img,result);return result;};
   const capture=(f,n)=>{draws=[];ctx.save();ctx.setTransform(1,0,0,1,0,0);drawSprite(f,1,n);ctx.restore();return draws[0];};
   try{
    for(const {id}of Roster.definitions){
     const baseEcb=CharacterData[id].ecb.height,f=makeFighter(0,0,id);f.x=720;f.y=560;f.inv=0;fighters=[f,makeFighter(1,0,'dragoon')];
     const scale=originalArt(id),idle=capture(f,0),target=BattleSize.heights[id];
     if(target)check(id+' visible standing height',Math.abs(idle.height*body(idle.img).height/idle.img.height-target)<2);
     check(id+' collider inside standing sprite',f.character.ecb.height<=idle.height+2);
     check(id+' shared character data preserved',near(baseEcb,CharacterData[id].ecb.height));
     for(const face of [-1,1]){f.face=face;
      for(let n=0;n<40&&n<characterArt[id].frames.length;n++){
       const resized=capture(f,n);BattleSize.art=()=>1;const original=capture(f,n);BattleSize.art=originalArt;
       check(id+'/'+face+'/'+n+' same source at uniform scale',resized.img===original.img&&near(resized.height/original.height,scale)&&near(resized.width/original.width,scale));
      }
      for(const n of [0,...Array.from({length:16},(_,i)=>24+i)]){
       f.grounded=true;f.state=n===0?'idle':n<32?'walk':'run';
       const image=characterArt[id].frames[n],bottom=body(image).bottom;
       for(const time of [0,24,72]){frame=time;const d=capture(f,n),localY=d.dy+d.h*bottom/image.height,worldY=d.m.d*localY+d.m.f;if(id==='edelgard'&&n>=24)check(id+'/'+face+'/'+n+'/'+time+' authored airborne stride',BattleSize.baseline(f,n)===EdelgardArtRects.bottomPad[n]);else check(id+'/'+face+'/'+n+'/'+time+' feet grounded',Math.abs(worldY-f.y)<2);}
      }
      f.state='idle';
      for(const ledge of StageRules.ledges){
       const point=ledgeHangPosition(f,ledge);BattleSize.art=()=>1;const base=ledgeHangPosition(f,ledge);BattleSize.art=originalArt;
       check(id+'/'+face+' ledge hand follows size',near(point.x-ledge.x,(base.x-ledge.x)*scale)&&near(point.y-ledge.y,(base.y-ledge.y)*scale));
      }
     }
     state='menu';const menu=capture(f,0);BattleSize.art=()=>1;const baseMenu=capture(f,0);BattleSize.art=originalArt;state='pause';
     check(id+' selection image size preserved',near(menu.height,baseMenu.height)&&near(menu.width,baseMenu.width));
     if(NewcomerCore.ids.includes(id)){
      const point={x:f.x+55,y:f.y-60},q=NewcomerCore.registry[id].spawn(f,{bodyOrigin:true,...point,vx:12,vy:-1}),expected=BattleSize.point(f,point);
      check(id+' projectile leaves resized body',near(q.x,expected.x)&&near(q.y,expected.y)&&q.vx===12&&q.vy===-1);
     }
    }
    const cat=makeFighter(0,0,'kitten');cat.x=700;cat.y=650;cat.attack={gravitySlide:true,sliding:true,surface:'ceiling',motionX:1,motionY:0};
    const origin=kittenDrawOriginY(cat),p=kittenWorldPoint(cat,28,-39),scaled=BattleSize.point(cat,p),s=BattleSize.geometry(cat);
    check('ceiling slide keeps body anchored at ceiling',near(scaled.y,origin+(p.y-origin)*s));
    for(const id of ['nier','miku','naruhodo']){
     const f=makeFighter(0,0,id);f.x=700;f.y=560;f.inv=0;fighters=[f,makeFighter(1,0,'dragoon')];attack(f,'heavy');f.timer=f.attack.activeFrames[0].start;
     const raw=baseAttackBoxes(f),boxes=attackBoxes(f),s=BattleSize.geometry(f);
     const expected=MeleeBalance.boxes(f,f.attack,raw.map(b=>({...b,x1:f.x+(b.x1-f.x)*s,x2:f.x+(b.x2-f.x)*s,y1:f.y+(b.y1-f.y)*s,y2:f.y+(b.y2-f.y)*s,radius:b.radius*s})));
     check(id+' weapon geometry keeps melee reach and inner coverage',boxes.length===expected.length&&boxes.every((b,i)=>near(b.x1,expected[i].x1)&&near(b.y1,expected[i].y1)&&near(b.x2,expected[i].x2)&&near(b.y2,expected[i].y2)&&near(b.radius,expected[i].radius)));
    }
    const f=makeFighter(0,0,'morphie');f.x=700;f.y=400;fighters=[f,makeFighter(1,0,'dragoon')];const regular=capture(f,0).height;
    for(const s of [.65,1.5,2]){MorphieRules.resize(f,s);check('intentional size shift '+s,near(capture(f,0).height,regular*s));}
   }finally{ctx.drawImage=originalDraw;BattleSize.art=originalArt;}
   return{characters:Roster.definitions.length,checks,failures};
  });
  console.log(JSON.stringify({...result,errors},null,2));if(result.failures.length||errors.length)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
