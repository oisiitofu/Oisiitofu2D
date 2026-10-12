'use strict';
// Cell boundaries protect neighboring soft effects from component merging.
function extractAdolEffects(sheet){return Array.from({length:8},(_,n)=>{const w=sheet.width/4,h=sheet.height/2,c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,n%4*w,Math.floor(n/4)*h,w,h,0,0,w,h);return c;});}
const AdolArtAnchors=[.60,.63,.67,.60,.63,.62,.41,.63,.55,.43,.53,.63,.61,.40,.65,.61,.64,.59,.56,.54,.48,.53,.61,.50,...Array(8).fill(.68),...Array(8).fill(.71)];
const TerryArtAnchors=[.51,.57,.58,.55,.55,.56,.42,.62,.48,.39,.52,.55,.51,.51,.52,.48,.55,.51,.51,.50,.50,.50,.52,.50,...Array(16).fill(.59)];
const ValkyrieArtAnchors=[.62,.65,.67,.64,.64,.66,.44,.64,.54,.45,.61,.61,.60,.56,.66,.61,.63,.63,.63,.57,.50,.58,.63,.50,...Array(8).fill(.62),...Array(8).fill(.67)];
