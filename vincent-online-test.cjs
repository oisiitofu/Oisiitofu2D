require('./.tools/run-native-online.cjs')('vincent').catch(e=>{console.error(e);process.exitCode=1;});
