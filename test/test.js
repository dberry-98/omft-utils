// Require everything including our function
var chai = require('chai');
var expect = chai.expect;
var outils = require('..');

describe('omft-utils test suite', function() {
  var f1 = './test/binfile';
  var f2 = 'README.md';
  var f4 = './test/genSoapTest.data';

  it('Return true for file ' +f1, function() {
    var r1 = outils.isBinary(f1);
    expect(r1).to.be.true; // verify results
  });

  it('Return false for file ' + f2, function() {
    var r2 = outils.isBinary(f2);
    expect(r2).to.be.false; // verify results
  });

  it('Parse input parameters from MFT RunScript callout ', function() {
    var ar = [];
    ar[0] = 'file=test.xml';
    ar[1] = 'outfile=out.xml outdir=/tmp/mft';
    var obj = outils.parseCalloutArgs(ar);
    var resmatch = 'test.xml out.xml /tmp/mft';
    var r3 = obj.file +' ' +obj.outfile + ' ' +obj.outdir;
    expect(r3).to.equal(resmatch); // verify results
  });

  it('Validate generated soap body filesize for file test/genSoapTest.data ', function() {
    var mysize = 544;
    outils.genUploadSOAP(f4, 999999999, 'SOAP', function(er, fsz, bdy) {
      if (er) {
        console.log('genSoapTest SOAP: error ' +er);
        throw err;
      } 
      var r4 = fsz;
      expect(r4).to.equal(mysize); // verify results
    });
  });

  it('Validate generated soap body empty for type=WSA attachments', function() {
    var mysize = 753;
    outils.genUploadSOAP(f4, 999999999, 'WSA', function(er, fsz, bdy) {
      if (er) {
        console.log('genSoapTest WSA: error ' +er);
        throw err;
      } 
      //console.log("bdy i s" +bdy);
      var r5 = bdy.length;
      expect(r5).to.equal(mysize); // verify results
    });
  });

  it('Validate generated request body filesize for file test/genSoapTest.data ', function() {
    var mysize = 544; //1810;
    var opts = {
      "type":          "SOAP",
      "file":          f4,
      "filetype":      "binary",
      "maxsize":       26214400,
      "templatedir":   __dirname
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genSoapTest SOAP: error ' +er);
        throw err;
      } 
      var r5 = fsz;
      expect(r5).to.equal(mysize); // verify results
    });
  });

});


