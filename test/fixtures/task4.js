'use strict';

var count = 0;

module.exports = function () {
  console.log('hello');
  require('fs').writeFileSync(__dirname + '/test.txt', 'testing' + count);
};

module.exports.watch = 'test/tmp/**/*';
