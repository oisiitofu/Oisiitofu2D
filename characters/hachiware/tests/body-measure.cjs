function bodyMeasure(g){
 let sx=0,n=0,top=g.h,bottom=0,left=g.w,right=0;
 for(let y=0;y<g.h;y++){let row=0;for(let x=0;x<g.w;x++){const i=(y*g.w+x)*4,[r,bg,b,a]=g.pixels.subarray(i,i+4);if(a>220&&r>185&&bg>180&&b>160&&Math.max(r,bg,b)-Math.min(r,bg,b)<65){sx+=x;n++;row++;left=Math.min(left,x);right=Math.max(right,x);}}if(row>=g.w*.05){top=Math.min(top,y);bottom=y+1;}}
 if(!n)throw Error('Missing white cat body');
 for(let y=0;y<top;y++){let row=0;for(let x=left;x<=right;x++){const i=(y*g.w+x)*4;if(g.pixels[i+3]>220)row++;}if(row>Math.max(4,(right-left)*.06)){top=y;break;}}
 return{body:bottom-top,pad:g.h-bottom,anchor:sx/n/g.w};
}
