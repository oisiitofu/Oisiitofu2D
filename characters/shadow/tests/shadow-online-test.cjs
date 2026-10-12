require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});
require('../../../.tools/run-native-online.cjs')('shadow').catch(e=>{console.error(e);process.exitCode=1;});
