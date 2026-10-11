require('./.tools/run-native-online.cjs')('tressa').catch(e=>{console.error(e);process.exitCode=1;});
