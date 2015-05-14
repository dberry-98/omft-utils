
# omft-utils

Utility functions for use with Oracle MFT - Managed File Transfer nodeJS modules and applications.

## Installation

npm install omft-utils --save

## Usage

[See examples folder](examples)

### Function parseCalloutArgs
#### Parse arguments from an MFT callout

    var outils = require('omft-utils');
    var ar = [];
    ar[0] = 'file=test.xml'
    ar[1] = 'outfile=out.xml outdir=/tmp/mft'
    var o = outils.parseCalloutArgs(ar);
    console.log('o.file: ' +o.file);
    console.log('o.outfile: ' +o.outfile);
    console.log('o.outdir: ' +o.outdir);


### Function genUploadRequest (can front end genUploadSoap) 
#### Generate a payload for any type of MFT request. SOAP, WSA, HTTP Forms etc...
#### Takes an options object as an argument so it is easy to extend.

```
var opts = { "type": "SOAP", "ctype": "binary", "file": process.argv[1], "filetype": "binary",
  "maxsize": 26214400, "templatedir": path.join(__dirname, '../files')
};

outils.genUploadRequest(opts, function(er, fsz, bdy) {
  if (er) {
    console.log('genRequestTest SOAP: error ' +er);
    process.exit(1);
  }
  console.log('SUCCESS: filesize is ' +fsz);
  console.log('file is   ' +opts.file);
  console.log('type is    ' +opts.type);
  console.log('ctype is   ' +opts.ctype);
  console.log('maxsize is   ' +opts.maxsize);
  console.log('templatedir is   ' +opts.templatedir);
  console.log('Body is   ' +bdy);
});
```

### Function genUploadSOAP
#### Generate a SOAP payload for an MFT SOAP Source 

```
// type = "SOAP|FORM"
var outils = require('..');
var fs = require("fs");
var f1 = process.argv[1];
var type = "SOAP" // or "FORM"
var MAX_FILE_SIZE = 25*1024*1024;
outils.genUploadSOAP(f1, MAX_FILE_SIZE, type, function(er, fs, bdy) {
  if (er) {
    console.log(err);
    process.exit(1);
  }
  console.log('SUCCESS: filesize is ' +fs);
  console.log('type is ' +type);
  console.log('Body is ' +bdy);
});
```

### Function isBinary
#### Check the file type before upload

```
// simple example
var f1 = process.argv[1];
var f2 = './test/binfile';
var f3 = 'NOFILE';
var result,s;

try {
  console.log(outils.isBinary(f1)); // returns true
  console.log(outils.isBinary(f2)); // returns false
  console.log(outils.isBinary(f3)); // throws error
} catch (e) {
  console.log(e);
};
```

## Test

npm install chai

npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

Created: May 3, 2015

## Credits

Dave Berry A.K.A (bigfiles)

## License

ISC
