// The build prepends FILES: pathname -> immutable SHA-256 object key.
export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url),pathname=decodeURIComponent(url.pathname);
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
  if(request.method==='GET'&&!range){const cached=await caches.default.match(cacheKey);if(cached)return cached;}
  const object=request.method==='HEAD'?await env.BUCKET.head(sha):await env.BUCKET.get(sha,range?{range:request.headers}:undefined);
  if(!object)return new Response('公開データを準備しています',{status:503,headers:{'Retry-After':'60'}});
  const extension=name.split('.').pop(),types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json; charset=utf-8',png:'image/png',webp:'image/webp',wav:'audio/wav',mp3:'audio/mpeg',ogg:'audio/ogg',flac:'audio/flac'};
  const headers=new Headers({'Content-Type':types[extension]||'application/octet-stream',ETag:etag,'Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Cache-Control':name==='index.html'||name.endsWith('.json')||name.endsWith('.js')||name.endsWith('.css')?'public, max-age=0, must-revalidate':'public, max-age=31536000, immutable'});
  let status=200;
  if(object.range){status=206;headers.set('Content-Range',`bytes ${object.range.offset}-${object.range.offset+object.range.length-1}/${object.size}`);headers.set('Content-Length',object.range.length);}
  else headers.set('Content-Length',object.size);
  const response=new Response(request.method==='HEAD'?null:object.body,{status,headers});
  if(status===200&&request.method==='GET'&&!range)ctx.waitUntil(caches.default.put(cacheKey,response.clone()));
  return response;
 }
};
