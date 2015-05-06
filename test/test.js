// Require everything including our function
var chai = require('chai');
var expect = chai.expect;
var outils = require('..');

describe('omft-utils test suite', function() {
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

  it('Validate generated soap body filesize for file test/genSoapTest.data ', function() {
    var fp = 'test/genSoapTest.data';
    var mysize = 544;
    outils.genUploadSOAP(fp, 999999999, function(er, fs, bdy) {
      if (er) {
        console.log('genSoapTest: error ' +er);
        throw err;
      } 
      //console.log('genSoapTest: result size is ' +fs);
      result = fs;
      expect(result).to.equal(mysize); // verify results
    });
  });

});


