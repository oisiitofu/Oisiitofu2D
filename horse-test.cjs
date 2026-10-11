require('./.tools/horse-test.cjs')('horse').catch(e=>{console.error(e);process.exitCode=1;});
