require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});
require('./helpers/horse-test.cjs')('horse').catch(e=>{console.error(e);process.exitCode=1;});
