require('./.tools/run-native-online.cjs')('kiryu').catch(e=>{console.error(e);process.exitCode=1;});
