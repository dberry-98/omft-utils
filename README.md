
# omft-utils

Utility functions for use with Oracle MFT - Managed File Transfer

## Installation

npm install omft-utils --save

## Usage

[See examples folder](examples)

    // function isBinary
    // check file type before upload
    var outils = require('omft-utils');
    console.log(outils.isBinary('test.bin));
    console.log(outils.isBinary('test.xml));

    // function parseCalloutArgs
    // Parse arguments from an MFT callout
    var outils = require('omft-utils');
    var ar = [];
    ar[0] = 'file=test.xml'
    ar[1] = 'outfile=out.xml outdir=/tmp/mft'
    var o = outils.parseCalloutArgs(ar);
    console.log('o.file: ' +o.file);
    console.log('o.outfile: ' +o.outfile);
    console.log('o.outdir: ' +o.outdir);

## Test

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
