// The build prepends FILES: pathname -> immutable SHA-256 object key.
const ONLINE_KEY='online/current-v1.json',ONLINE_LEASE_MS=180000;
const onlineHeaders={'Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'};
function tunnelOrigin(value){try{const u=new URL(value);return u.protocol==='https:'&&/^[a-z0-9-]+\.trycloudflare\.com$/.test(u.hostname)&&!u.port&&!u.username&&!u.password&&u.pathname==='/'&&!u.search&&!u.hash?u.origin:null;}catch{return null;}}
const onlineJson=(value,status=200)=>Response.json(value,{status,headers:onlineHeaders});
function waitingPage(){return new Response(`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>オンライン対戦｜TOFU BROS.</title><style>body{margin:0;background:#0b1422;color:#e8f4ff;font:16px system-ui;display:grid;place-items:center;min-height:100vh}main{max-width:540px;margin:24px;padding:40px;border:1px solid #294660;border-radius:16px}small{color:#88cfff;letter-spacing:.15em}h1{font-size:28px}p{line-height:1.9;color:#b9c9dc}button,a{display:inline-block;padding:12px 18px;background:#76bdff;color:#07121f;border:0;border-radius:8px;font:inherit;text-decoration:none;cursor:pointer}a{background:#20364b;color:#d8ebff}#status{font-size:13px}</style><main><small>TOFU BROS. / ONLINE</small><h1>対戦サーバーは起動待ちです</h1><p>公開側のPCで「start-online.bat」を起動すると接続できます。このページのURLは変わりません。</p><p id="status">起動を確認したら自動でキャラ選択画面へ進みます。</p><button onclick="location.reload()">接続を確認</button> <a href="/">メニューへ戻る</a></main><script>setInterval(async()=>{try{const r=await fetch('/api/online-route',{cache:'no-store'}),s=await r.json();if(s.online)location.reload();}catch{}},10000);</script></html>`,{status:503,headers:{...onlineHeaders,'Content-Type':'text/html; charset=utf-8','Retry-After':'10'}});}
export async function onlineRoute(request,env){
 const url=new URL(request.url),entry=url.pathname==='/online'||url.pathname==='/online/';
 if(!entry&&url.pathname!=='/api/online-route')return null;
 if(!['GET','HEAD'].includes(request.method)){
  if(entry)return new Response('Method not allowed',{status:405,headers:onlineHeaders});
  if(!env.ONLINE_ROUTE_TOKEN||request.headers.get('Authorization')!=='Bearer '+env.ONLINE_ROUTE_TOKEN)return new Response('Unauthorized',{status:401,headers:onlineHeaders});
  if(!['PUT','DELETE'].includes(request.method))return new Response('Method not allowed',{status:405,headers:onlineHeaders});
  if(Number(request.headers.get('Content-Length'))>2048)return onlineJson({error:'Request too large'},413);
  let data;try{const text=await request.text();if(text.length>2048)throw Error();data=JSON.parse(text);}catch{return onlineJson({error:'Invalid request'},400);}
  if(typeof data.instance!=='string'||!/^[a-zA-Z0-9-]{8,80}$/.test(data.instance))return onlineJson({error:'Invalid instance'},400);
  if(request.method==='DELETE'){const saved=await env.BUCKET.get(ONLINE_KEY);if(saved&&(await saved.json()).instance===data.instance)await env.BUCKET.delete(ONLINE_KEY);return new Response(null,{status:204,headers:onlineHeaders});}
  const origin=tunnelOrigin(data.url);if(!origin)return onlineJson({error:'Invalid tunnel URL'},400);
  // The authenticated launcher checks /health before each lease renewal.
  // Keep the public locator independent of edge-to-tunnel fetch restrictions.
  const now=Date.now();await env.BUCKET.put(ONLINE_KEY,JSON.stringify({url:origin,instance:data.instance,updatedAt:now,expiresAt:now+ONLINE_LEASE_MS}),{httpMetadata:{contentType:'application/json'}});return new Response(null,{status:204,headers:onlineHeaders});
 }
 const saved=await env.BUCKET.get(ONLINE_KEY);let current;try{current=saved?await saved.json():null;}catch{current=null;}
 const online=!!(current&&current.expiresAt>Date.now()&&tunnelOrigin(current.url));
 if(!entry)return onlineJson(online?{online:true,url:current.url,updatedAt:current.updatedAt}:{online:false});
 const room=url.searchParams.get('room');if(room&&!/^[a-fA-F0-9]{6}$/.test(room))return onlineJson({error:'Invalid room code'},400);
 if(!online){const response=waitingPage();return request.method==='HEAD'?new Response(null,response):response;}
 const target=new URL(current.url);target.searchParams.set('mode','online');if(room)target.searchParams.set('room',room.toUpperCase());return new Response(null,{status:302,headers:{...onlineHeaders,Location:target.href}});
}
export default {
 async fetch(request,env,ctx){
  const online=await onlineRoute(request,env);if(online)return online;
  const url=new URL(request.url);let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{return new Response('Bad path',{status:400});}
  if(pathname.startsWith('/_asset-upload/')){
   if(!env.ASSET_UPLOAD_TOKEN||request.headers.get('Authorization')!=='Bearer '+env.ASSET_UPLOAD_TOKEN)return new Response('Not found',{status:404});
   const sha=pathname.slice('/_asset-upload/'.length);
   if(!Object.values(FILES).includes(sha))return new Response('Unknown asset',{status:400});
   if(request.method==='HEAD')return new Response(null,{status:await env.BUCKET.head(sha)?200:404});
   if(request.method!=='PUT')return new Response('Method not allowed',{status:405});
   // R2 validates the checksum while streaming; large images need no buffering.
   await env.BUCKET.put(sha,request.body,{sha256:sha});
   return new Response(null,{status:204});
  }
  if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
  const name=pathname==='/'?'index.html':pathname.slice(1),sha=FILES[name];
  if(!sha)return new Response('Not found',{status:404});
  const etag='"'+sha+'"';
  if(request.headers.get('If-None-Match')===etag)return new Response(null,{status:304,headers:{ETag:etag}});
  const cacheKey=new Request(url.origin+'/_cache/'+sha),range=request.headers.get('Range');
  // Some hosted dispatch runtimes disable Cache API. R2 and browser caching
  // remain available there, so an unavailable edge cache must not block play.
  if(request.method==='GET'&&!range)try{const cached=await caches.default.match(cacheKey);if(cached)return cached;}catch{}
  const object=request.method==='HEAD'?await env.BUCKET.head(sha):await env.BUCKET.get(sha,range?{range:request.headers}:undefined);
  if(!object)return new Response('公開データを準備しています',{status:503,headers:{'Retry-After':'60'}});
  const extension=name.split('.').pop(),types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json; charset=utf-8',png:'image/png',webp:'image/webp',wav:'audio/wav',mp3:'audio/mpeg',ogg:'audio/ogg',flac:'audio/flac'};
  const headers=new Headers({'Content-Type':types[extension]||'application/octet-stream',ETag:etag,'Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Cache-Control':name==='index.html'||name.endsWith('.json')||name.endsWith('.js')||name.endsWith('.css')?'public, max-age=0, must-revalidate':'public, max-age=31536000, immutable'});
  let status=200;
  if(range&&object.range){status=206;headers.set('Content-Range',`bytes ${object.range.offset}-${object.range.offset+object.range.length-1}/${object.size}`);headers.set('Content-Length',object.range.length);}
  else headers.set('Content-Length',object.size);
  const response=new Response(request.method==='HEAD'?null:object.body,{status,headers});
  if(status===200&&request.method==='GET'&&!range)try{ctx?.waitUntil(caches.default.put(cacheKey,response.clone()).catch(()=>{}));}catch{}
  return response;
 }
};
