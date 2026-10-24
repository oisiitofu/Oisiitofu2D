'use strict';
// Shared wire format; retain exact axis values and every held/edge button.
const InputCodec=(()=>{
 const format='compact-v1',axes=['x','y','rx','ry'],flags=['shareStock','jump','jumpHeld','twoJumps','attackHeld','jab','heavy','heavyHeld','forceTilt','smash','smashHeld','charge','special','specialHeld','guard','guardHeld','grab','grabHeld'],modeBit=1<<flags.length,maskLimit=(modeBit<<1)-1;
 const axis=v=>Number.isFinite(v)?Math.max(-1,Math.min(1,v)):0;
 function decode(value){const packed=Array.isArray(value),bits=packed&&Number.isInteger(value[4])?value[4]&maskLimit:0,input={};axes.forEach((key,n)=>input[key]=axis(packed?value[n]:value?.[key]));flags.forEach((key,n)=>input[key]=packed?!!(bits&(1<<n)):value?.[key]===true);input.rightStickMode=packed?bits&modeBit?'smash':'tilt':value?.rightStickMode==='smash'?'smash':'tilt';input.holdBuffer=false;return input;}
 function encode(value){let bits=value.rightStickMode==='smash'?modeBit:0;flags.forEach((key,n)=>{if(value[key]===true)bits|=1<<n;});return[...axes.map(key=>axis(value[key])),bits];}
 return{format,axes,flags,decode,encode};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=InputCodec;
