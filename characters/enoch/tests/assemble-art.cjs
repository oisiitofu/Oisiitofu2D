'use strict';
require('../../../build-character-atlas.cjs')('enoch','Enoch',98,["gale-basic","gale-attacks","veil-basic","veil-attacks"]).catch(e=>{console.error(e);process.exitCode=1;});
