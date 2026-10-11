require('./.tools/run-native-test.cjs')('donchan').catch(e=>{console.error(e);process.exitCode=1;});
