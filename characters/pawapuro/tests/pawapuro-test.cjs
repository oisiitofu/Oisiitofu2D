require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../previews'),{recursive:true});
require('./helpers/pawapuro-test.cjs')('pawapuro');
