require('./.tools/run-native-test.cjs')('wargreymon').catch(e=>{console.error(e);process.exitCode=1;});
