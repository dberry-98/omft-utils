    //var outils = require('omft-utils');
    var outils = require('..');
    var ar = [];
    ar[0] = 'file=test.xml'
    ar[1] = 'outfile=out.xml outdir=/tmp/mft'
    var o = outils.parseCalloutArgs(ar);
    console.log('o.file: ' +o.file);
    console.log('o.outfile: ' +o.outfile);
    console.log('o.outdir: ' +o.outdir);




/*


var outils = require('..');

// simple example
//   ar[0] = 'file=test.xml'
//   ar[1] = 'outfile=out.xml outdir=/tmp/mft'
//   ret = { file: 'test.xml', outfile: 'out.xml', outdir: '/mft/tmp' } 

var ar = [];
ar[0] = 'file=test.xml';
ar[1] = 'outfile=out.xml outdir=/tmp/mft';

var o = outils.parseCalloutArgs(ar);
console.log(o);
console.log('o.file: ' +o.file);
console.log('o.outfile: ' +o.outfile);
console.log('o.outdir: ' +o.outdir);


*/
