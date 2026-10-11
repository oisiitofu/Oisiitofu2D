require('./.tools/run-native-test.cjs')('eve').catch(e=>{console.error(e);process.exitCode=1;});
