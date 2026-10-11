require('./.tools/run-native-test.cjs')('kiryu').catch(e=>{console.error(e);process.exitCode=1;});
