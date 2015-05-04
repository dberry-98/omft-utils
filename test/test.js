// Require everything including our function
var chai = require('chai');
var expect = chai.expect;
var outils = require('..');

describe('isBinary', function() {
  it('Return true for filename of test.bin ', function() {
    var result = outils.isBinary('test.bin');
    expect(result).to.be.true; // verify results
  });
  it('Return false for filename of test.xml ', function() {
    var result = outils.isBinary('test.xml');
    expect(result).to.be.false; // verify results
  });
});
