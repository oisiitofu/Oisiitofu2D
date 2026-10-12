require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});
require('../../../.tools/newcomer-test.cjs')('terrarian').catch(e=>{console.error(e);process.exitCode=1;});
