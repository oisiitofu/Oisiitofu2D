require('./.tools/run-native-test.cjs')('rocbouquet').catch(e=>{console.error(e);process.exitCode=1;});
