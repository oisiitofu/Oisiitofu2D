require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});
require('../../../.tools/run-native-test.cjs')('donchan').catch(e=>{console.error(e);process.exitCode=1;});
