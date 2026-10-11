'use strict';
// Only the static edition substitutes this adapter for online.js.
const Net=(()=>{
 function init(){
  const button=document.querySelector('#enter-online');
  button.onclick=()=>location.assign(PublicOnlineConfig.onlineUrl);
  button.title='オンライン対戦サーバーを開く';
  const room=new URLSearchParams(location.search).get('room');
  if(room&&/^[A-Fa-f0-9]{6}$/.test(room)){
   const url=new URL(PublicOnlineConfig.onlineUrl);url.searchParams.set('room',room.toUpperCase());location.replace(url.href);
  }
 }
 const noop=()=>{};
 return{init,leave:noop,capture:noop,finished:noop,ready:noop,status:noop,active:false,applying:false,code:'',slot:0,config:null,inputs:null,starting:false};
})();
