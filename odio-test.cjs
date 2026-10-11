require('./.tools/run-native-test.cjs')('odio').catch(e=>{console.error(e);process.exitCode=1;});
