require('./.tools/run-native-test.cjs')('mametchi').catch(e=>{console.error(e);process.exitCode=1;});
