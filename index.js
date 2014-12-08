'use strict';

var path     = require('path');
var glob     = require('glob');
var defaults = require('defaults');

// There might be a better way of doing this. I remember reading an article that
// peerDependencies should be deprecated and is considered bad practice, so I'm
// hoping that this solution is a bit better.
var gulp     = module.parent.require('gulp');

module.exports = function (options) {
  // If options is a string, assume that it is the dirname
  if (isString(options)) {
    options = { dirname: options };
  }

  // Establish the defaults
  options = defaults(options, {
    dirname: 'tasks',
    cwd: process.cwd(),
    pattern: '*.js',
    watchExt: '.watch',
  });

  // This is the task pattern. Will look something like 'tasks/*.js'
  var tasksPattern = path.join(options.dirname, options.pattern);
  // This will be the array of filepaths found from given pattern in the given
  // current working directory
  var taskFiles    = glob.sync(tasksPattern, {cwd: options.cwd});

  taskFiles.map(function (taskFile) {
    var basename     = path.basename(taskFile, path.extname(taskFile));
    var task         = require(path.join(options.cwd, taskFile));

    var taskName     = task.taskName || basename;
    var dependencies = task.dependencies || [];
    var taskFunc     = isFunction(task) ? task : null;

    gulp.task(taskName, dependencies, taskFunc);

    if (task.watch) {
      gulp.task(taskName + options.watchExt, [taskName], function () {
        gulp.watch(task.watch, [taskName]);
      });
    }
  });

  // return gulp
  return gulp;
};

function isString(str) {
  return typeof str === 'string' || str instanceof String;
}

function isFunction(func) {
  return typeof func === 'function';
}
