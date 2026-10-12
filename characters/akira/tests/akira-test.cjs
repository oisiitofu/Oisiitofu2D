require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});
require('./helpers/akira-test.cjs')('akira').catch(e=>{console.error(e);process.exitCode=1;});
