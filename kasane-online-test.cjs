require('./.tools/run-native-online.cjs')('kasane').catch(e=>{console.error(e);process.exitCode=1;});
