require('./.tools/run-native-test.cjs')('greymon').catch(e=>{console.error(e);process.exitCode=1;});
