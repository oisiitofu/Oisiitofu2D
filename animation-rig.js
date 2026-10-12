'use strict';
// Shared, deterministic interpolation. Character-specific poses remain in
// characters/<id>/; these helpers never read wall time or mutate a fighter.
const AnimationRig=(()=>{
 const clamp01=t=>Math.max(0,Math.min(1,t)),smooth=t=>{t=clamp01(t);return t*t*(3-2*t);};
 const copy=p=>Object.fromEntries(Object.entries(p).map(([k,v])=>[k,[...v]]));
 function mix(a,b,t){t=smooth(t);if(t===0)return copy(a);if(t===1)return copy(b);return Object.fromEntries(Object.keys(a).map(k=>[k,a[k].map((v,n)=>{const d=b[k][n]-v;return v+(n===2?Math.atan2(Math.sin(d),Math.cos(d)):d)*t;})]));}
 function transform(p,x,y){const c=Math.cos(p[2]),s=Math.sin(p[2]);return[p[0]+x*c-y*s,p[1]+x*s+y*c];}
 function leg(hip,ankle,upper,lower,bend=1){const dx=ankle[0]-hip[0],dy=ankle[1]-hip[1],raw=Math.hypot(dx,dy),distance=Math.max(Math.abs(upper-lower)+.001,Math.min(upper+lower-.001,raw||.001)),ux=raw?dx/raw:0,uy=raw?dy/raw:1,along=(upper*upper-lower*lower+distance*distance)/(2*distance),off=Math.sqrt(Math.max(0,upper*upper-along*along));return{hip,knee:[hip[0]+ux*along-uy*off*bend,hip[1]+uy*along+ux*off*bend],ankle:[hip[0]+ux*distance,hip[1]+uy*distance]};}
 return{smooth,copy,mix,transform,leg};
})();
