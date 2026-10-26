'use strict';
// v2 adds optional command aim after the v1 tuple. Movement stays live.
// Old clients negotiate plain JSON, which already carries stickAttack.
const InputCodec=(()=>{
 const format='compact-v2',axes=['x','y','rx','ry'],flags=['shareStock','jump','jumpHeld','twoJumps','attackHeld','jab','heavy','heavyHeld','forceTilt','smash','smashHeld','charge','special','specialHeld','guard','guardHeld','grab','grabHeld'],modeBit=1<<flags.length,maskLimit=(modeBit<<1)-1;
 const axis=v=>Number.isFinite(v)?Math.max(-1,Math.min(1,v)):0;
 function decode(value){const packed=Array.isArray(value),bits=packed&&Number.isInteger(value[4])?value[4]&maskLimit:0,input={};axes.forEach((key,n)=>input[key]=axis(packed?value[n]:value?.[key]));flags.forEach((key,n)=>input[key]=packed?!!(bits&(1<<n)):value?.[key]===true);input.rightStickMode=packed?bits&modeBit?'smash':'tilt':value?.rightStickMode==='smash'?'smash':'tilt';const aim=packed&&value.length>=7?{x:value[5],y:value[6]}:value?.stickAttack;if(aim&&['jab','heavy','smash','special','grab'].some(k=>input[k])&&Number.isFinite(aim.x)&&Number.isFinite(aim.y))input.stickAttack={x:axis(aim.x),y:axis(aim.y)};input.holdBuffer=false;return input;}
 function encode(value){let bits=value.rightStickMode==='smash'?modeBit:0;flags.forEach((key,n)=>{if(value[key]===true)bits|=1<<n;});const packed=[...axes.map(key=>axis(value[key])),bits];if(value.stickAttack&&['jab','heavy','smash','special','grab'].some(k=>value[k]))packed.push(axis(value.stickAttack.x),axis(value.stickAttack.y));return packed;}
 return{format,axes,flags,decode,encode};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=InputCodec;
