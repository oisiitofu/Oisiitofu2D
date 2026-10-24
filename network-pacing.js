'use strict';
// Presentation clock for the ordered, authoritative input stream. No prediction,
// skipped simulation frames, fabricated inputs, or changes to combat timing.
const NetworkPacing=(()=>{
 const stepMs=1000/60;
 function create(){let queue=[],head=0,received=0,applied=0,target=2,nextAt=null,lastAt=null,lastGap=stepMs,jitter=0,underruns=0,peak=0,lastStarved=-Infinity,lastRaised=-Infinity,primed=false;
  const count=()=>queue.length-head;
  function reset(){queue=[];head=received=applied=0;target=2;nextAt=lastAt=null;lastGap=stepMs;jitter=underruns=peak=0;lastStarved=lastRaised=-Infinity;primed=false;}
  function receive(packet,now){if(packet.frame!==received+1)throw Error('Non-sequential online frame');if(count()>=300)throw Error('Online frame backlog');if(lastAt!==null){const gap=Math.max(0,now-lastAt);jitter+=.1*(Math.abs(gap-lastGap)-jitter);lastGap=gap;const need=Math.min(5,Math.max(2,Math.ceil(gap/stepMs)-1));if(need>target){target=need;lastRaised=now;}}lastAt=now;received=packet.frame;queue.push(packet);peak=Math.max(peak,count());}
  function take(apply){const packet=queue[head++];applied=packet.frame;if(head>120){queue=queue.slice(head);head=0;}return apply(packet);}
  function advance(now,apply){if(!primed){if(count()<target)return 0;primed=true;nextAt=now;}if(now-lastRaised>10000&&now-lastStarved>10000&&target>2){target--;lastRaised=now;}let steps=0;
   // Catch up gently after a stalled draw, bounded to keep input/render responsive.
   // Long network gaps refill the small buffer instead of applying a whole burst.
   if(nextAt<now-stepMs*4)nextAt=now-stepMs*3;
   if(count()>target+6)nextAt=Math.min(nextAt,now-stepMs*Math.min(3,count()-target-3));
   while(now+.25>=nextAt&&steps<4){if(!count()){underruns++;lastStarved=now;target=Math.min(5,target+1);primed=false;nextAt=null;break;}const depth=count();steps++;if(take(apply)===false)break;nextAt+=stepMs*(depth>target+3?.94:1);}
   return steps;
  }
  function flush(apply){let n=0;while(count()){n++;if(take(apply)===false)break;}primed=false;nextAt=lastAt=null;lastGap=stepMs;return n;}
  return{receive,advance,flush,reset,get metrics(){return{receivedFrames:received,appliedFrames:applied,queuedFrames:count(),bufferFrames:target,underruns,peakQueuedFrames:peak,arrivalJitterMs:jitter};}};
 }
 return{create,stepMs};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=NetworkPacing;
