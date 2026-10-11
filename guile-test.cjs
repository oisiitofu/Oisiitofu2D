require('./.tools/run-native-test.cjs')('guile').catch(e=>{console.error(e);process.exitCode=1;});
