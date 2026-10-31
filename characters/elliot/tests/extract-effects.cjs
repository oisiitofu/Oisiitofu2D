'use strict';
// Observed complete asset boxes in cleanFx (1983x793). Preserve source alpha,
// including the deliberately translucent blue magic-ring paint.
const sharp=require('sharp');
module.exports=async(file)=>{const rects=[[0,0,342,397],[330,135,430,145],[740,45,410,328],[1145,50,402,340],[1545,95,438,225],[0,397,350,396],[350,397,390,396],[740,380,410,413],[1135,410,422,383],[1565,315,418,478]],out=[];for(const [cell,r]of rects.entries()){const v=await sharp(file).extract({left:r[0],top:r[1],width:r[2],height:r[3]}).extend({top:3,bottom:3,left:3,right:3,background:'#00000000'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});out.push({pixels:v.data,w:v.info.width,h:v.info.height,cell,box:r});}return out;};
