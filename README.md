
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


### Function genUploadRequest 
#### Returns a payload for any type of MFT request. SOAP, WSA, WSSE ... 
#### Takes an options object as an argument so it is easy to extend.

This is ithe JSON config file but supports comments.

```
var opts = {
  "type": "SOAP",             // "WSA"
  "ctype": "binary",          // "text" 
  "reqtemps": true,           // require templates of false means only payload substitution if template not found
  "file": process.argv[1],
  "maxsize": 26214400,        // 25MB limits the size of the SOAP payload. WSA can be higher value
  "templatedir": path.join(__dirname, '../files') // overrides the default template dir
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

### Function varSub
#### A simple paramterized substitution templating interface
#### Takes date string and subvar object as arguments with optional delimeter as 3rd argument
#### Returns the substituted result
```
var ts = new Date().toISOString();
var data =  'Hello %%NAME%% it is now %%ISOTIME%%';
var vals = {'NAME': 'Dave', 'isoTIME': ts};
console.log(outils.varSub(data, vals));
```

### Function isBinary
#### Checks the file type before upload
#### Returns true for binary, false for text or error for file not found

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
