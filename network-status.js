'use strict';
// Wall-clock presentation only. Never changes packets, pacing or simulation.
const NetworkStatus=(()=>{
 function create(){
  let active=false,lastApplied=0,waiting=false,recoverySince=null;
  function reset(){active=false;lastApplied=0;waiting=false;recoverySince=null;}
  function begin(now){active=true;lastApplied=now;waiting=false;recoverySince=null;}
  function applied(now){if(!active)return;if(waiting&&(recoverySince===null||now-lastApplied>100))recoverySince=now;lastApplied=now;}
  function grace(now){if(active){lastApplied=now;waiting=false;recoverySince=null;}}
  function update(now,eligible=true,hidden=false){
   if(!active||!eligible){reset();return false;}
   if(hidden){grace(now);return false;}
   const gap=Math.max(0,now-lastApplied);
   if(gap>=500){waiting=true;recoverySince=null;}
   else if(waiting&&recoverySince!==null&&now-recoverySince>=250&&gap<=100)waiting=false;
   return waiting;
  }
  return{begin,reset,applied,grace,update,get state(){return{active,lastApplied,waiting,recoverySince};}};
 }
 const monitor=create();let shown=false;
 function show(value){if(shown===value)return;shown=value;if(typeof document!=='undefined')document.getElementById('network-wait')?.classList.toggle('hidden',!value);}
 function reset(){monitor.reset();show(false);}
 function begin(now){monitor.begin(now);show(false);}
 function applied(now){monitor.applied(now);}
 function pump(now,eligible,hidden){show(monitor.update(now,eligible,hidden));}
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{monitor.grace(performance.now());show(false);});
 return{create,begin,reset,applied,pump};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=NetworkStatus;
