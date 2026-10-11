require('./.tools/run-native-test.cjs')('frog').catch(e=>{console.error(e);process.exitCode=1;});
