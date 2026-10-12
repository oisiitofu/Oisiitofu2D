'use strict';
// Only the static edition substitutes this adapter for online.js.
const Net=(()=>{
 function onlineUrl(room){
  const url=new URL(PublicOnlineConfig.onlineUrl);url.searchParams.set('mode','online');
  if(room)url.searchParams.set('room',room.toUpperCase());return url.href;
 }
 function init(){
  const button=document.querySelector('#enter-online');
  button.onclick=()=>location.assign(onlineUrl());
  button.title='オンライン対戦のキャラ選択画面を開く';
  const room=new URLSearchParams(location.search).get('room');
  if(room&&/^[A-Fa-f0-9]{6}$/.test(room)){
   location.replace(onlineUrl(room));
  }
 }
 const noop=()=>{};
 return{init,returnToSelection:noop,leave:noop,capture:noop,finished:noop,ready:noop,status:noop,active:false,applying:false,code:'',slot:0,config:null,inputs:null,starting:false};
})();
