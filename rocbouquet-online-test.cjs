require('./.tools/run-native-online.cjs')('rocbouquet').catch(e=>{console.error(e);process.exitCode=1;});
