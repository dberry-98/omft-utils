// Require everything including our function
var chai = require('chai');
var expect = chai.expect;
var outils = require('..');

describe('isBinary', function() {
  it('Return true for filename of test.bin ', function() {
    var result = outils.isBinary('test.bin');
    expect(result).to.be.true; // verify results
  });

  it('Return false for filename of test.xml ', function() {
    var result = outils.isBinary('test.xml');
    expect(result).to.be.false; // verify results
  });

  it('Parse input parameters from MFT RunScript callout ', function() {
    var ar = [];
    ar[0] = 'file=test.xml';
    ar[1] = 'outfile=out.xml outdir=/tmp/mft';
    var obj = outils.parseCalloutArgs(ar);
    var resmatch = 'test.xml out.xml /tmp/mft';
    var result = obj.file +' ' +obj.outfile + ' ' +obj.outdir;
    expect(result).to.equal(resmatch); // verify results
  });
});



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
