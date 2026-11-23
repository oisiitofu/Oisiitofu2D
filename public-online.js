'use strict';
// Only the static edition substitutes this adapter for online.js.
const Net=(()=>{
 function onlineUrl(room){
  const endpoint=typeof PublicOnlineConfig==='undefined'?'/online':PublicOnlineConfig.onlineUrl;
  const url=new URL(endpoint,location.href);url.searchParams.set('mode','online');
  if(room)url.searchParams.set('room',room.toUpperCase());
  const pool=Roster.stagePoolRecord();
  if(pool.updatedAt)url.hash=new URLSearchParams({'stage-random':JSON.stringify(pool)}).toString();
  return url.href;
 }
 const browse=()=>location.assign(onlineUrl());
 function init(){PlayerNames.init();
  const button=document.querySelector('#enter-online');
  button.onclick=browse;
  button.title='オンラインの部屋一覧を開く';
  const room=new URLSearchParams(location.search).get('room');
  if(new URLSearchParams(location.search).get('mode')==='online'||room&&/^[A-Fa-f0-9]{6}$/.test(room)){
   location.replace(onlineUrl(room));
  }
 }
 const noop=()=>{};
 return{init,browse,playerName:id=>id===0?PlayerNames.current:(id+1)+'P',returnToSelection:noop,leave:noop,capture:noop,finished:noop,refreshResult:noop,ready:noop,status:noop,active:false,applying:false,code:'',slot:0,config:null,inputs:null,starting:false};
})();
