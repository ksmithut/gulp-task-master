'use strict';

module.exports = function () {
  console.testLog = console.testLog || console.log;
  console.testLog('ran task1');
};
