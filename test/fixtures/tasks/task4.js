'use strict';

var count = 0;
var fs = require('fs');
var path = require('path');

module.exports = function () {
  console.testLog = console.testLog || console.log;
  console.testLog('ran watcher');
};

module.exports.watch = 'test/watcher.txt';
