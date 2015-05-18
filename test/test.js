// Require everything including our function
var chai = require('chai');
var expect = chai.expect;
var outils = require('..');

describe('omft-utils test suite', function() {
  var f1 = './test/binfile';
  var f2 = 'README.md';
  var f4 = './test/genSoapTest.data';
  var f11 = 'test/template.data';

  it('TEST 1: eturn true for file ' +f1, function() {
    var r1 = outils.isBinary(f1);
    expect(r1).to.be.true; // verify results
  });

  it('Return false for file ' + f2, function() {
    var r2 = outils.isBinary(f2);
    expect(r2).to.be.false; // verify results
  });

  it('TEST 2: Parse input parameters from MFT RunScript callout ', function() {
    var ar = [];
    ar[0] = 'file=test.xml';
    ar[1] = 'outfile=out.xml outdir=/tmp/mft';
    var obj = outils.parseCalloutArgs(ar);
    var resmatch = 'test.xml out.xml /tmp/mft';
    var r3 = obj.file +' ' +obj.outfile + ' ' +obj.outdir;
    expect(r3).to.equal(resmatch); // verify results
  });

  it('TEST 3: Validate generated soap body filesize for file test/genSoapTest.data ', function() {
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

  it('TEST 4: Validate generated soap body empty for type=WSA attachments', function() {
    var mysize = 745;
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

  it('TEST 5: Validate templating and generated request body filesize for file test/genSoapTest.data ', function() {
    var mysize = 1314;
    var opts = {
      "type":          "SOAP",
      "file":          f4,
      "maxsize":       26214400,
      "templatedir":   __dirname
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genUploadRequestTest SOAP: error ' +er);
        throw err;
      } 
      //console.log('genUploadRequestTest SOAP: body:' +bdy);
      var r5 = bdy.length;
      expect(r5).to.equal(mysize); // verify results
    });
  });

  it('TEST 6: Validate varSub templating ', function() {
    var mystr = 'Hello Dave it is now '; 
    var ts = new Date().toISOString();
    var data =  'Hello %%NAME%% it is now %%ISOTIME%%';
    var vals = {'NAME': 'Dave', 'isoTIME': ts};
    var r6 = outils.varSub(data, vals);
    expect(r6).to.have.string(mystr); // verify results
  });

  it('TEST 7: Validate varSub templating with alternate substr', function() {
    var mystr = 'Hello Dave it is now %%ISOTIME%%'; 
    var ts = new Date().toISOString();
    var data = 'Hello ##NAME## it is now %%ISOTIME%%';
    var vals = {'name': 'Dave', 'isoTIME': ts};
    var r7 = outils.varSub(data, vals, '##');
    expect(r7).to.equal(mystr); // verify results
  });


  it('TEST 8: Test ctype=text for file test/genSoapTest.data ', function() {
    var mysize = 1127;
    var opts = {
      "type":          "SOAP",
      "ctype":         "TEXT",
      "file":          f4,
      "maxsize":       26214400,
      "templatedir":   __dirname
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genUploadRequestTest SOAP: error ' +er);
        throw err;
      } 
      //console.log('genSoapTest SOAP: body:' +bdy);
      var r8 = bdy.length;
      expect(r8).to.equal(mysize); // verify results
    });
  });

  it('TEST 9: Validate no templates with reqtemps=false using file test/genSoapTest.data ', function() {
    var mysize = 728;
    var opts = {
      "type":          "SOAP",
      "file":          f4,
      "reqtemps":       false,
      "templatedir":   "INVALID_DIRNAME"
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genSoapTest SOAP: error ' +er);
        throw err;
      } 
      //console.log('genUploadRequestTest SOAP: body:' +bdy);
      var r9 = bdy.length;
      expect(r9).to.equal(mysize); // verify results
    });
  });

  it('TEST 10: Validate no payload returned with getbody=false using file test/binfile ', function() {
    var mysize = 753;
    var opts = {
      "type":          "WSA",
      "file":           f4,
      "retbody":       false // true is default. False is for WSA where payload is separate from SOAP Payload.
    };

    outils.genUploadRequest(opts, function(er, fsz, soapbody) {
      if (er) {
        console.log('genSoapTest WSA: error ' +er);
        throw err;
      } 
      //console.log('genUploadRequestTest WSA: body:' +soapbody);
      var r10 = soapbody.length;
      expect(r10).to.equal(mysize); // verify results
    });
  });

  it('TEST 11: Template subvars validation using file test/template.data', function() {
    var mysize = 271;
    var opts = {
      "type":          "SOAP",
      "ctype":         "TEXT",
      "file":          f11,
      "reqtemps":      false,
      "templatedir":   "NOTEMPLATES",
      "user":          "SCOTTISH",
      "pass":          "LIONS"
    };

    outils.genUploadRequest(opts, function(er, fsz, rawbody) {
      if (er) {
        console.log('genUploadRequestTest Template Test: error ' +er);
        throw err;
      } 
      //console.log('genUploadRequest Test Template: body:' +rawbody);
      var r11 = rawbody.length;
      expect(r11).to.equal(mysize); // verify results
    });
  });

  it('TEST 12: Support OOTB RunScript callout parameters: filename & dir', function() {
    var ar = [];
    ar[0] = 'filename=binfile dir=test/';
    ar[1] = 'outfile=out.xml outdir=/tmp/mft';
    var obj = outils.parseCalloutArgs(ar);

    if (!obj.file) {
      var er = 'obj.file not found';
      console.log(er);
      throw er;
    };

    var resmatch = 'test/binfile out.xml /tmp/mft';
    var r12 = obj.file +' ' +obj.outfile + ' ' +obj.outdir;
    expect(r12).to.equal(resmatch); // verify results
  });


});

