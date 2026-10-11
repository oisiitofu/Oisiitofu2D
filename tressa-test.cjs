require('./.tools/run-native-test.cjs')('tressa').catch(e=>{console.error(e);process.exitCode=1;});
