'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=__dirname;
const files=new Set(require('./script-bundle.cjs').files(root));
for(const file of fs.readdirSync(root))if(/\.(js|cjs)$/.test(file))files.add(file);
function visit(dir){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const file=dir+'/'+entry.name;if(entry.isDirectory()){if(['assets','previews','docs'].includes(entry.name))continue;visit(file);}else if(/\.(js|cjs)$/.test(file))files.add(file);}}
visit('characters');
for(const file of files){const result=spawnSync(process.execPath,['--check',file],{cwd:root,stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
console.log(`Syntax OK: ${files.size} files`);
