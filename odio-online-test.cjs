require('./.tools/run-native-online.cjs')('odio').catch(e=>{console.error(e);process.exitCode=1;});
