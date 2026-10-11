require('./.tools/run-native-test.cjs')('laharl').catch(e=>{console.error(e);process.exitCode=1;});
