require('./.tools/run-native-online.cjs')('mametchi').catch(e=>{console.error(e);process.exitCode=1;});
