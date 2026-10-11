require('./.tools/run-native-test.cjs')('deemo').catch(e=>{console.error(e);process.exitCode=1;});
