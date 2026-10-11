require('./.tools/run-native-test.cjs')('vincent').catch(e=>{console.error(e);process.exitCode=1;});
