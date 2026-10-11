require('./.tools/run-native-test.cjs')('shadow').catch(e=>{console.error(e);process.exitCode=1;});
