// Require everything including our function
var chai = require('chai');
var expect = chai.expect;
var outils = require('..');
var path = require('path');

describe('omft-utils test suite', function() {
  var f1 = './test/binfile';
  var f2 = 'README.md';
  var f4 = './test/genRequestTest.data';
  var f11 = 'test/template.data';

  it('TEST 1: Return true for file ' +f1, function() {
    var r1 = outils.isBinary(f1);
    expect(r1).to.be.true; // verify results
  });

  it('TEST 2: Return false for file ' + f2, function() {
    var r2 = outils.isBinary(f2);
    expect(r2).to.be.false; // verify results
  });

  it('TEST 3: Parse input parameters from MFT RunScript callout ', function() {
    var ar = [];
    ar[0] = 'file=test.xml';
    ar[1] = 'outfile=out.xml outdir=/tmp/mft';
    var obj = outils.parseCalloutArgs(ar);
    var resmatch = 'test.xml out.xml /tmp/mft';
    var r3 = obj.file +' ' +obj.outfile + ' ' +obj.outdir;
    expect(r3).to.equal(resmatch); // verify results
  });

  it('TEST 4: Validate templatedir and generated request body for dir test/', function() {
    var mysize = 1320;
    var opts = {
      "type":          "SOAP",
      "file":          f4,
      "maxsize":       26214400,
      "templatedir":   __dirname
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genUploadRequestTest SOAP: error ' +er);
        throw er;
      } 
      //console.log('genUploadRequestTest SOAP: body:' +bdy);
      //console.log('genUploadRequestTest templatedir ' +opts.templatedir);
      var r5 = bdy.length;
      expect(r5).to.equal(mysize); // verify results
    });
  });

  it('TEST 5: Validate varSub templating ', function() {
    var mystr = 'Hello Dave it is now '; 
    var ts = new Date().toISOString();
    var data =  'Hello %%NAME%% it is now %%ISOTIME%%';
    var vals = {'NAME': 'Dave', 'isoTIME': ts};
    var r6 = outils.varSub(data, vals);
    expect(r6).to.have.string(mystr); // verify results
  });

  it('TEST 6: Validate varSub templating with alternate substr', function() {
    var mystr = 'Hello Dave it is now %%ISOTIME%%'; 
    var ts = new Date().toISOString();
    var data = 'Hello ##NAME## it is now %%ISOTIME%%';
    var vals = {'name': 'Dave', 'isoTIME': ts};
    var r7 = outils.varSub(data, vals, '##');
    expect(r7).to.equal(mystr); // verify results
  });


  it('TEST 7: Test ctype=text for file test/genSoapTest.data ', function() {
    var mysize = 1133;
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
        throw er;
      } 
      //console.log('genSoapTest SOAP: body:' +bdy);
      var r8 = bdy.length;
      expect(r8).to.equal(mysize); // verify results
    });
  });

  it('TEST 8: Validate no templates with reqtemps=false using file test/genSoapTest.data ', function() {
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
        throw er;
      } 
      //console.log('genUploadRequestTest SOAP: body:' +bdy);
      var r9 = bdy.length;
      expect(r9).to.equal(mysize); // verify results
    });
  });

  it('TEST 9: Validate no payload returned with retbody=false using file test/binfile ', function() {
    var mysize = 759;
    var opts = {
      "type":          "WSA",
      "file":           f4,
      "retbody":       false // true is default. False is for WSA where payload is separate from SOAP Payload.
    };

    outils.genUploadRequest(opts, function(er, fsz, soapbody) {
      if (er) {
        console.log('genSoapTest WSA: error ' +er);
        throw er;
      } 
      //console.log('genUploadRequestTest WSA: body:' +soapbody);
      var r10 = soapbody.length;
      expect(r10).to.equal(mysize); // verify results
    });
  });

  it('TEST 10: Template subvars validation using file test/template.data', function() {
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
        throw er;
      } 
      //console.log('genUploadRequest Test Template: body:' +rawbody);
      var r11 = rawbody.length;
      expect(r11).to.equal(mysize); // verify results
    });
  });

  it('TEST 11: Support OOTB RunScript callout parameters: filename & dir', function() {
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


  it('TEST 12: Validate template option and generated request body for template file test/SOAP-PAYLOAD', function() {
    var mysize = 1317;
    var opts = {
      "type":          "SOAP",
      "file":          f4,
      "maxsize":       26214400,
      "template":      __dirname+'/SOAP-PAYLOAD-TEXT'
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genUploadRequestTest SOAP: error ' +er);
        throw er;
      } 
      //console.log('genUploadRequestTest SOAP: body:' +bdy);
      //console.log('genUploadRequestTest template ' +opts.template);
      var rs = bdy.length;
      expect(rs).to.equal(mysize); // verify results
    });
  });


  it('TEST 13: "template" and "templatedir" cannot be used together', function() {
    var rs;
    var myrs = 'generateUploadRequest ERROR: template and templatedir cannot be used together:';
    var opts = {
      "type":          "SOAP",
      "file":          f4,
      "templatedir":      __dirname,
      "template":      __dirname+'/SOAP-PAYLOAD-TEXT'
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        //console.log('genUploadRequestTest error: ' +er);
	rs = er;
      } 
      expect(rs).to.have.string(myrs); // verify results
    });
  });

  it('TEST 14: Validate template custom variables using template file test/templateCustom.data', function() {
    var myrs = 'omft-utils/test Application Cubist';
    var opts = {
      "type":          "SOAP",
      "ctype":         "text",
      "file":          __dirname+'/templateCustom.data',
      "maxsize":       26214400,
      "template":      __dirname+'/templateCustom.data',
      "templatevars":  { "Application": "Cubist"},
      "retbody":       false // true is default. False is for WSA where payload is separate from SOAP Payload.
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genUploadRequestTest SOAP: error ' +er);
        throw er;
      } 
      //console.log(opts);
      var rs = bdy.length;
      var ba = bdy.split(' ');
      //console.log('TEST:' +ba);
      expect(bdy).to.have.string(myrs); // verify results
    });
  });


  it('TEST 15: Test maxsize error', function() {
    var myrs = 'generateUploadRequest ERROR: ./test/genRequestTest.data filesize 544 exceeds maximum supported size of 40';
    var opts = {
      "type":          "SOAP",
      "file":          f4,
      "maxsize":       40
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      //if (er) {
      //} 
      //console.log(opts);
      expect(er).to.equal(myrs); // verify results
    });
  });

  it('TEST 16: Test custom "template" config option', function() {
    var mysize = 1133;
    var opts = {
      "type":          "SOAP",
      "ctype":         "TEXT",
      "file":          f4,
      "maxsize":       26214400,
      "template":      path.join(__dirname, 'MY-PAYLOAD')
    };

    outils.genUploadRequest(opts, function(er, fsz, bdy) {
      if (er) {
        console.log('genUploadRequestTest SOAP: error ' +er);
        throw er;
      } 
      //console.log('genSoapTest SOAP: body:' +bdy);
      var r8 = bdy.length;
      expect(r8).to.equal(mysize); // verify results
    });
  });


});

