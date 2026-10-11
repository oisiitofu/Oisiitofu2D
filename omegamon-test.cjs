require('./.tools/run-native-test.cjs')('omegamon').catch(e=>{console.error(e);process.exitCode=1;});
