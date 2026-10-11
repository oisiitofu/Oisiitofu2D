require('./.tools/run-native-test.cjs')('kisuke').catch(e=>{console.error(e);process.exitCode=1;});
