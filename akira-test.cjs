require('./.tools/akira-test.cjs')('akira').catch(e=>{console.error(e);process.exitCode=1;});
