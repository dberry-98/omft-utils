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

  it('Validate templating and generated request body filesize for file test/genSoapTest.data ', function() {
    var mysize = 1328;
    var opts = {
      "type":          "SOAP",
      "file":          f4,
      "maxsize":       26214400,
      "templatedir":   __dirname
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genSoapTest SOAP: error ' +er);
        throw err;
      } 
      //console.log('genSoapTest SOAP: body:' +bdy);
      var r5 = bdy.length;
      expect(r5).to.equal(mysize); // verify results
    });
  });

  it('Validate varSub templating ', function() {
    var mystr = 'Hello Dave it is now '; 
    var ts = new Date().toISOString();
    var data =  'Hello %%NAME%% it is now %%ISOTIME%%';
    var vals = {'NAME': 'Dave', 'isoTIME': ts};
    var r6 = outils.varSub(data, vals);
    expect(r6).to.have.string(mystr); // verify results
  });

  it('Validate varSub templating with alternate substr', function() {
    var mystr = 'Hello Dave it is now %%ISOTIME%%'; 
    var ts = new Date().toISOString();
    var data = 'Hello ##NAME## it is now %%ISOTIME%%';
    var vals = {'name': 'Dave', 'isoTIME': ts};
    var r7 = outils.varSub(data, vals, '##');
    expect(r7).to.equal(mystr); // verify results
  });


  it('Test ctype=text for file test/genSoapTest.data ', function() {
    var mysize = 1141;
    var opts = {
      "type":          "SOAP",
      "ctype":         "TEXT",
      "file":          f4,
      "maxsize":       26214400,
      "templatedir":   __dirname
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genSoapTest SOAP: error ' +er);
        throw err;
      } 
      //console.log('genSoapTest SOAP: body:' +bdy);
      var r8 = bdy.length;
      expect(r8).to.equal(mysize); // verify results
    });
  });



});

