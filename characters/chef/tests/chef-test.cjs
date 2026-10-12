require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});
require('./helpers/chef-test.cjs')('chef').catch(e=>{console.error(e);process.exitCode=1;});
