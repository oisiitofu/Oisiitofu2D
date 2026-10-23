const fs=require('fs');
for(const id of ['zack','presea']){
 const meta=JSON.parse(fs.readFileSync(`characters/${id}/tests/art-layout.json`));
 for(const file of ['newcomer-art.js','stage-system.js','player-system.js']){let s=fs.readFileSync(file,'utf8');if(file==='newcomer-art.js')s=s.replace(new RegExp(id+':\\[[^\\]]+\\]'),id+':'+JSON.stringify(meta.anchors));if(file==='stage-system.js')s=s.replace(new RegExp(id+':\\[[^\\]]+\\]'),id+':'+JSON.stringify(meta.grip));if(file==='player-system.js')s=s.replace(new RegExp('CharacterData\\.'+id+'=\\{[^\\n]+?;'),part=>part.replace(/"ledgeGrip":\[[^\]]+\]/,'"ledgeGrip":'+JSON.stringify(meta.grip)));fs.writeFileSync(file,s);}
}
