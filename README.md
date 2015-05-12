
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

    var outils = require('omft-utils');
    console.log(outils.isBinary('test.bin));
    console.log(outils.isBinary('test.xml));

This package is a better option so this Function  will ultimately be deprecated..
https://github.com/bevry/istextorbinary

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
