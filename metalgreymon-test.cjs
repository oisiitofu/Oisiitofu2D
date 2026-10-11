require('./.tools/run-native-test.cjs')('metalgreymon').catch(e=>{console.error(e);process.exitCode=1;});
