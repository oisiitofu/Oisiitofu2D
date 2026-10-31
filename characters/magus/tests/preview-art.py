"""Asset-only constant-scale visual QA; no game/source art modifications."""
from PIL import Image, ImageDraw
import json, pathlib
r=pathlib.Path('characters/magus');out=pathlib.Path('previews/magus');out.mkdir(exist_ok=True)
m=json.loads((r/'tests/art-layout.json').read_text());p=json.loads((r/'tests/native-points.json').read_text());atlas=Image.open(r/'assets/magus-native.png').convert('RGBA')
def sprite(n):
 x,y,w,h=m['frames'][n];return atlas.crop((x,y,x+w,y+h))
def draw_sprite(cv,n,ox,oy,scale,face=1,marks=False):
 im=sprite(n);w=round(im.width*scale);h=round(im.height*scale);im=im.resize((w,h),Image.Resampling.LANCZOS);anchor=p['anchors'][n]
 if face<0:im=im.transpose(Image.Transpose.FLIP_LEFT_RIGHT);anchor=1-anchor
 x=round(ox-anchor*w);y=round(oy-h+m['pads'][n]*scale);cv.alpha_composite(im,(x,y))
 if marks:
  d=ImageDraw.Draw(cv);a,b=p['pelvis'][n];a=a if face>0 else 1-a;cx=x+a*w;cy=y+b*h;d.ellipse((cx-3,cy-3,cx+3,cy+3),fill='#53f0d7')
 return x,y,w,h
frames=[]
for k in range(5):
 cv=Image.new('RGBA',(1300,630),'#24324a');d=ImageDraw.Draw(cv)
 for j,c in enumerate(p['normals']):
  ox=j%5*260;oy=j//5*210;n=[0,76+j,16+j,91+j,0][k];d.text((ox+8,oy+8),c['move']+' / '+str(n),fill='white');d.line((ox,oy+176,ox+260,oy+176),fill='#536178');draw_sprite(cv,n,ox+120,oy+176,98/226)
 frames.append(cv.convert('RGB'))
frames[0].save(out/'normal-transitions.gif',save_all=True,append_images=frames[1:],duration=[220,150,200,200,200],loop=0)
# At twice game body-height, inspect the actual hand/weapon/boot contacts.
cv=Image.new('RGBA',(1750,1200),'#24324a');d=ImageDraw.Draw(cv)
for j,c in enumerate(p['normals']):
 ox=j%5*350;oy=j//5*400;n=c['frame'];d.text((ox+8,oy+8),c['move']+' '+str(n),fill='white');x,y,w,h=draw_sprite(cv,n,ox+170,oy+340,196/226,marks=True)
 a,b=c['grip'],c['tip'];q=(x+a[0]*w,y+a[1]*h,x+b[0]*w,y+b[1]*h);d.line(q,fill='#ff627b',width=2)
 for a in [c['grip'],c['tip']]:cx=x+a[0]*w;cy=y+a[1]*h;d.ellipse((cx-4,cy-4,cx+4,cy+4),outline='#ffeb78',width=2)
cv.convert('RGB').save(out/'normal-contacts.png')
# Native normalized effects (2 now convex-up), with mirrored directional checks.
cv=Image.new('RGBA',(1280,1280),'#24324a');d=ImageDraw.Draw(cv)
for n,rect in enumerate(m['effects']):
 x,y,w,h=rect;im=atlas.crop((x,y,x+w,y+h));im.thumbnail((280,270),Image.Resampling.LANCZOS);ox=n%4*320;oy=n//4*320;cv.alpha_composite(im,(ox+(320-im.width)//2,oy+35));d.text((ox+8,oy+8),str(n),fill='white')
cv.convert('RGB').save(out/'effects-normalized.png')
print('Created animation, contact and normalized effect previews')
