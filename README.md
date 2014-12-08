# gulp-task-master

[![NPM version](http://img.shields.io/npm/v/gulp-task-master.svg?style=flat)](https://www.npmjs.org/package/gulp-task-master)
[![Dependency Status](http://img.shields.io/gemnasium/ksmithut/gulp-task-master.svg?style=flat)](https://gemnasium.com/ksmithut/gulp-task-master)
[![Code Climate](http://img.shields.io/codeclimate/github/ksmithut/gulp-task-master.svg?style=flat)](https://codeclimate.com/github/ksmithut/gulp-task-master)
[![Build Status](http://img.shields.io/travis/ksmithut/gulp-task-master.svg?style=flat)](https://travis-ci.org/ksmithut/gulp-task-master)
[![Coverage Status](http://img.shields.io/codeclimate/coverage/github/ksmithut/gulp-task-master.svg?style=flat)](https://codeclimate.com/github/ksmithut/gulp-task-master)

Yet another module to help you modularize your gulp tasks. This may seem a bit
opinionated, but it was originally built to help with my own personal projects.
There are configuration options available to tailor it to your setup.

# Installation

You must have [`gulp`](https://www.npmjs.org/package/gulp) installed in your own
project in order for this plugin to work. Install gulp if you haven't already.

```bash
npm install --save-dev gulp
```

Then install this package

```bash
npm install --save-dev gulp-task-master
```

# Usage

In your project's `gulpfile.js`:

```javascript
'use strict';

var gulp = require('gulp-task-master')();
```

Then in your project's `tasks` directory, create your task files:

```javascript
// tasks/styles.js
'use strict';

var gulp   = require('gulp');
var less   = require('gulp-less');
var concat = require('gulp-concat');
var please = require('gulp-pleeease');

module.exports = function () {
  return gulp.src('src/styles/**/*.less')
    .pipe(less())
    .pipe(concat('app.min.css'))
    .pipe(please())
    .pipe(gulp.test('dist/css'));
};
```

Now, you have `gulp styles` available in your gulp tasks. It got the 'styles'
task name from the filename.

# Advanced Usage

In addition to attaching your task function to your `module.exports`, you can
also define task dependencies, a custom task name (that isn't just the
filename), and even a watcher for your specific task (useful for css or js build
scripts).

Below is an example of a script with all of these custom options.

```javascript
// tasks/scripts.js
'use strict';

var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

module.exports = function () {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
};

module.exports.dependencies = ['coffee'];
module.exports.taskName     = 'js';
module.exports.watch        = 'src/scripts/**/*.js';
```

The watch task gets the same task name of the task defined plus a '.watch'
(configurable). So the above example would expose the 'js' task, plus a
'js.watch' task.

You may also specify a task that just has dependencies, such as an overall build
task:

```javascript
// tasks/build.js
'use strict';

exports.dependencies = ['scripts', 'styles'];
```

Now you can run `gulp build`, and it will run both the `scripts` and the
`styles` tasks.

# Configuration

In your main `gulpfile.js`, you pass the options in an object hash (pojo) in the
function call to `gulp-task-master`. Default options shown below:

```javascript
'use strict';

var gulp = require('gulp-task-master')({
  dirname: 'tasks',   // The directory that tasks are located in
  pattern: '*.js',    // Pattern to use when looking for task files
  cwd: process.cwd(), // Current working directory configuration
  watchExt: '.watch'  // Extension to append to the end of watch tasks
});

// You can still define your own tasks or group tasks here
gulp.task('default', ['watch']);

gulp.task('build', [
  'js',
  'styles'
]);

gulp.task('watch', [
  'js.watch'
]);
```

If you pass in a string instead of the options hash, it will put it in the
`dirname` option and just use the defaults as the rest of the options.

```javascript
var gulp = require('gulp-task-master')('gulp-tasks/');
```

# Contributing

PRs Welcome!

If you have a great idea on how to improve this, feel free to submit an issue
or a pull requests. Although it's got 100% test coverage, I know that test
coverage alone doesn't test for all use cases.
