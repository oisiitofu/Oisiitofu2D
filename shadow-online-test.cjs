require('./.tools/run-native-online.cjs')('shadow').catch(e=>{console.error(e);process.exitCode=1;});
