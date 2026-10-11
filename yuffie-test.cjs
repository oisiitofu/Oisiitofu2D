require('./.tools/run-native-test.cjs')('yuffie').catch(e=>{console.error(e);process.exitCode=1;});
