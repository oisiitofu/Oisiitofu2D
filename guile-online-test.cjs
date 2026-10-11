require('./.tools/run-native-online.cjs')('guile').catch(e=>{console.error(e);process.exitCode=1;});
