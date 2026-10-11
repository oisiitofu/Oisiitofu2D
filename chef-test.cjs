require('./.tools/chef-test.cjs')('chef').catch(e=>{console.error(e);process.exitCode=1;});
