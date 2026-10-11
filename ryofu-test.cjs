require('./.tools/run-native-test.cjs')('ryofu').catch(e=>{console.error(e);process.exitCode=1;});
