require('./.tools/run-native-test.cjs')('charlotta').catch(e=>{console.error(e);process.exitCode=1;});
