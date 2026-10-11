require('./.tools/run-native-online.cjs')('ryofu').catch(e=>{console.error(e);process.exitCode=1;});
