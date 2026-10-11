require('./.tools/run-native-test.cjs')('sumino').catch(e=>{console.error(e);process.exitCode=1;});
