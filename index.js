'use strict';

var _        = require('lodash');
var path     = require('path');
var glob     = require('glob');

// There might be a better way of doing this. I remember reading an article that
// peerDependencies should be deprecated and is considered bad practice, so I'm
// hoping that this solution is a bit better.
var gulp     = module.parent.require('gulp');

module.exports = function (options) {
  // If options is a string, assume that it is the dirname
  if (_.isString(options)) {
    options = { dirname: options };
  }

  // Establish the defaults
  options = _.defaults(options, {
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

    // Transform the task object into a noop function if needed. This allows
    // to export, for example, just a dependencies task.
    if (!_.isFunction(task)) {
      task = _.noop;
    }

    gulp.task.call(gulp, taskName, dependencies, task);

    if (task.watch) {
      gulp.task(taskName + options.watchExt, [taskName], function () {
        gulp.watch(task.watch, [taskName]);
      });
    }
  });

  // return gulp
  return gulp;
};
