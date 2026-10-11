'use strict';
const fs=require('node:fs'),path=require('node:path'),{Readable}=require('node:stream');
async function hiddenInput(){return new Promise(resolve=>{let value='';const terminal=process.stdin.isTTY;function finish(){process.stdin.removeAllListeners('data');if(terminal)process.stdin.setRawMode(false);process.stdin.pause();resolve(JSON.parse(value));}if(terminal)process.stdin.setRawMode(true);process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>{value+=chunk;if(value.includes('\n')||value.includes('\r'))finish();});process.stdin.resume();console.log('Ready for upload JSON on stdin (input is hidden).');});}
(async()=>{
 const {token,url}=await hiddenInput(),inputs=JSON.parse(fs.readFileSync(path.join(__dirname,'.tools/local-public-site/upload-inputs.json'))),failures=[];let complete=0,bytes=0,last=0;
 await Promise.all(Array.from({length:6},async()=>{while(inputs.length){const item=inputs.shift(),target=url+'/_asset-upload/'+item.sha;let done=false;
  for(let attempt=0;attempt<4&&!done;attempt++)try{
   const headers={Authorization:'Bearer '+token};
   const exists=await fetch(target,{method:'HEAD',headers,signal:AbortSignal.timeout(30000)});
   if(exists.status===200){done=true;break;}
   if(exists.status!==404)throw Error('HEAD '+exists.status);
   const response=await fetch(target,{method:'PUT',headers:{...headers,'Content-Length':String(item.size),'Content-Type':'application/octet-stream'},body:Readable.toWeb(fs.createReadStream(item.file)),duplex:'half',signal:AbortSignal.timeout(120000)});
   if(response.status!==204)throw Error('PUT '+response.status+': '+(await response.text()).slice(0,100));done=true;
  }catch(error){if(attempt===3)failures.push({file:path.basename(item.file),error:error.message});else await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));}
  if(done){complete++;bytes+=item.size;}if(Date.now()-last>15000){console.log(JSON.stringify({complete,remaining:inputs.length,bytes,failures:failures.length}));last=Date.now();}
 }}));
 console.log(JSON.stringify({complete,bytes,failures}));if(failures.length)process.exitCode=1;
})().catch(error=>{console.error(error.message);process.exitCode=1;});
