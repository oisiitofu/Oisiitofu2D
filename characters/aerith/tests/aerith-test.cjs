require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});
require('../../../.tools/run-native-test.cjs')('aerith');
