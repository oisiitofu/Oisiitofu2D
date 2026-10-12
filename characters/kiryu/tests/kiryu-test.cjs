require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});
require('../../../.tools/run-native-test.cjs')('kiryu').catch(e=>{console.error(e);process.exitCode=1;});
