'use strict';
// Completion evidence: focused current checks plus source identity to verified releases.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const read=f=>fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n'),json=f=>JSON.parse(read(f)),git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:8e6}).replace(/\r\n/g,'\n'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const expected=[1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],head=git('rev-parse','HEAD').trim(),receipts=[];
for(let n=1;n<=15;n++){
 const path=`quality-stage-${String(n).padStart(2,'0')}-publication.json`,r=json(path);receipts.push(r);
 assert.equal(r.versionNumber,161+n,path);assert.equal(r.deployment.status,'succeeded',path);assert.equal(r.deployment.version_id,r.versionId,path);assert.equal(r.uploadSecretRemoved,true,path);
 git('merge-base','--is-ancestor',r.gameCommit,'HEAD');
}
const completed=receipts.flatMap(r=>r.completedThisStage||r.completedItems.map(i=>i.number));assert.deepEqual(completed,expected);assert.deepEqual(receipts.at(-1).remainingItems,[]);
const refs={1:[8,['audio.js','battle-feel.js']],4:[12,['input.js','input-codec.js','online-server.cjs']],5:[2,['player-controller.js']],6:[2,['combat-system.js']],7:[3,['battle-readability.js']],8:[3,['air-mobility.js']],9:[4,['cpu-control.js']],10:[10,['character-guide.js']],11:[6,['battle-hud.js','characters/edf/edf-vfx.js','characters/rean/rean-vfx.js']],13:[8,['stage-system.js','characters/elma/elma-data.js','characters/goemon/goemon-data.js','characters/kitten/kitten-data.js','characters/kurabe/kurabe-data.js']],14:[9,['fighter-list.js','roster.js','squad-battle.js']],15:[10,['character-guide.js']],16:[11,['training-demo.js']],17:[12,['stick-calibration.js']],18:[13,['training-dummy.js']],19:[14,['network-status.js','network-pacing.js']],20:[15,['result-readiness.js','online.js','public-online.js']]};
const sourceChecks=[];
for(const[item,[stage,files]]of Object.entries(refs))for(const path of files){
 const r=receipts[stage-1],source=git('show',r.gameCommit+':'+path),current=read(path);assert.equal(current,source,path);
 sourceChecks.push({item:+item,path,verifiedVersion:r.versionNumber,verifiedCommit:r.gameCommit,sha256:sha(current)});
}
const game=read('game.js'),shared=[];
for(const[prefix,stage,item]of[['function cpuRaw(',4,9],['function cpu(',4,9],['function resetTraining(',11,16],['function drawBattleDecorations(',7,12]]){
 const get=s=>s.split('\n').filter(l=>l.startsWith(prefix));assert.equal(get(game).length,1);assert.deepEqual(get(game),get(git('show',receipts[stage-1].gameCommit+':game.js')));
 shared.push({item,function:prefix,verifiedVersion:receipts[stage-1].versionNumber,sha256:sha(get(game)[0])});
}
const draw=game.slice(game.indexOf('function render(){')),drawMarkers=['drawBattleDecorations();','NoctisVFX.drawObjects();','fighters.forEach(f=>{if(battleWorldHidden(f))return;drawFighter(f);','CombatVFX.drawImpacts();'];
assert.ok(drawMarkers.every((s,n)=>draw.indexOf(s)>=0&&(n===0||draw.indexOf(s)>draw.indexOf(drawMarkers[n-1]))));
const before=receipts[0].gameCommit+'^',order=s=>s.match(/const selectionOrder=\[[\s\S]*?\];/)[0];assert.equal(order(read('roster.js')),order(git('show',before+':roster.js')));
const untouched=['player-names.js','bingo-rules.js','bingo-battle.js','combat-data.js','move-motion.js','animation-rig.js','melee-balance.js','combat-engine.js','combat-vfx.js','battle-size.js','motion-size.js'];
for(const path of untouched)assert.equal(git('diff','--name-only',before,'HEAD','--',path).trim(),'',path);
assert.equal(git('diff','--name-only',before,'HEAD','--','assets').trim(),'','No committed source art/audio changes in the quality goal');
// Six descriptions append notes only; four body helpers and two gauge positions were independently verified in v167/v169.
const noteOnly=['edea','nightraven','noctis','tails','ulgrim','vivi'];for(const id of noteOnly){const path=`characters/${id}/${id}-data.js`,old=git('show',before+':'+path);assert.equal(read(path).split('\n// Selection notes describe existing move behavior; they do not tune combat.')[0].trimEnd(),old.trimEnd(),path);}
const changes=git('diff','--name-only',before,'HEAD','--','characters').trim().split('\n');
assert.deepEqual(changes.sort(),[...noteOnly.map(id=>`characters/${id}/${id}-data.js`),'characters/edf/edf-vfx.js','characters/rean/rean-vfx.js',...['elma','goemon','kitten','kurabe'].map(id=>`characters/${id}/${id}-data.js`)].sort());
const updates=source=>vm.runInNewContext(source+';HomeUpdates.entries',{document:{getElementById:()=>null}}),currentUpdates=updates(read('home-updates.js'));
const releaseUpdates=receipts.map(r=>updates(git('show',r.gameCommit+':home-updates.js'))[0]);
for(const e of releaseUpdates)assert.ok(currentUpdates.some(x=>JSON.stringify(x)===JSON.stringify(e)),'release update retained '+e.at);
assert.ok(read('home-updates.js').includes('sort((a,b)=>Date.parse(b.at)-Date.parse(a.at))'));
const native=json('.tools/quality-final-native-proof.json'),last=receipts.at(-1);assert.equal(native.latestVersionNumber,last.versionNumber);assert.equal(native.accessMode,'public');assert.equal(native.source.commit_sha,last.siteCommit);assert.equal(native.deployment.status,'succeeded');assert.equal(native.deployment.version_id,last.versionId);
assert.equal(git('-C','.tools/local-public-site','rev-parse','HEAD').trim(),last.siteCommit);
for(const[path,hash]of json('.tools/quality-15-changed.json'))assert.equal(sha(fs.readFileSync('.tools/local-public-site/app/'+path)),hash,path);
const assets=json('.tools/quality-15-public-assets.json');assert.deepEqual(assets,{sha256Files:2,htmlFiles:1,catalogMatches:true,onlineStatus:200});
const focused={};for(const[tag,count]of[['result-readiness-online-local',53],['result-readiness-online-public',53],['result-readiness-ui-local',13],['result-readiness-ui-public',13],['network-status-online-public-final',20],['clutter-completion',19]]){
 const r=json('previews/quality/'+tag+'.json');assert.equal(r.checks,count,tag);assert.deepEqual(r.errors,[],tag);if(r.failed)assert.deepEqual(r.failed,[],tag);focused[tag]=r;
}
assert.equal(focused['network-status-online-public-final'].identicalFrames,240);assert.equal(focused['result-readiness-online-public'].identicalRematchFrames,60);
assert.equal(receipts[0].verification.legacyRegression.fullSuitePassed,false);assert.equal(receipts[0].verification.legacyRegression.identicalFailures,true);
const rows=expected.map(item=>({item,releaseVersion:receipts.find(r=>(r.completedThisStage||r.completedItems.map(i=>i.number)).includes(item)).versionNumber,proof:item===12?'Exact decoration function, current draw order, fresh 19 checks and published receipt':item===20?'Current feature source, 35 unit checks, local/public 13 UI and 53 online checks':`Unchanged verified module(s) and published receipt${[9,16].includes(item)?'; shared game functions also identical':''}`}));
const report={completionEvidenceSatisfied:true,sourceHead:head,completedItems:expected,excludedItems:[2,3],remainingItems:[],releaseCount:15,currentVersion:176,sourceChecks,uniqueFilesCompared:new Set(sourceChecks.map(c=>c.path)).size,shared,rows,homeReleaseEntriesRetained:releaseUpdates.length,rosterOrderPreserved:true,sourceArtAndAttackMotionUnchanged:true,playerNameStorageAndBingoRulesUnchanged:true,pcOnly:true,focusedChecks:focused,native,publicAssets:assets,limits:['Prior per-stage tests are retained evidence, not rerun wholesale; unchanged source is compared to each verified release.','Normal rematch end fixtures call finish; Bingo fixture sets losing stocks to zero at frame 240.','The old broad battle-input-regression suite has 14 baseline failures, identically present before/after; it is not counted as passing.','No all-character/all-color asset sweep or mobile QA was performed.']};
fs.writeFileSync('quality-completion-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({completionEvidenceSatisfied:true,completedItems:expected,releaseCount:15,uniqueFilesCompared:report.uniqueFilesCompared,sharedFunctions:shared.length,homeReleaseEntriesRetained:releaseUpdates.length,currentVersion:176,focusedChecks:Object.fromEntries(Object.entries(focused).map(([k,v])=>[k,v.checks]))},null,2));
