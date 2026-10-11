require('./.tools/run-native-online.cjs')('eve').catch(e=>{console.error(e);process.exitCode=1;});
