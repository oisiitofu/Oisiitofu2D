require('./.tools/run-native-online.cjs')('laharl').catch(e=>{console.error(e);process.exitCode=1;});
