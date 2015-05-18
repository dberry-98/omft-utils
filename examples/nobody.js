// type = "WSA
var outils = require('..');
var fs = require("fs");
var path = require("path");

var type = "WSA"  // File is not in SOAP payload and added by the client later.

var opts = {
  "type":          "WSA",
  "file":          process.argv[1], // file is used for %%FILENAME%% template substitution and maxsize test.
  "retbody":       false            // true is default. For WSA where payload is separate from SOAP Payload.
};

outils.genUploadRequest(opts, function(er, fsz, bdy) {
  if (er) {
    console.log('genRequestTest WSA: error ' +er);
    process.exit(1);
  }
  console.log('SUCCESS: filesize is ' +fsz);
  console.log('file is   ' +opts.file);
  console.log('type is    ' +opts.type);
  console.log('retbody is   ' +opts.retbody);
  console.log('Body is   ' +bdy);
});
