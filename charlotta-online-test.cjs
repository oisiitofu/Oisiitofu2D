require('./.tools/run-native-online.cjs')('charlotta').catch(e=>{console.error(e);process.exitCode=1;});
