require('./.tools/run-native-online.cjs')('frog').catch(e=>{console.error(e);process.exitCode=1;});
