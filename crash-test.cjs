require('./.tools/run-native-test.cjs')('crash').catch(e=>{console.error(e);process.exitCode=1;});
