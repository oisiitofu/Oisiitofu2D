require('./.tools/run-native-test.cjs')('kasane').catch(e=>{console.error(e);process.exitCode=1;});
