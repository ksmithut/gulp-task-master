'use strict';

var expect     = require('expect.js');
var fs         = require('fs');
var taskMaster = require('../');
var Gulp       = require('gulp').Gulp;

describe('task master tests', function () {

  describe('level 1', function () {

    it('should grab all of the included modules', function () {
      /* jshint maxstatements: false */
      var gulp = taskMaster('test/fixtures');
      expect(gulp.Gulp).to.be(Gulp);
      expect(gulp.tasks).to.have.keys(
        'task1',
        'task2',
        'third-task',
        'task4',
        'task4.watch'
      );
      expect(gulp.tasks.task1.name).to.be('task1');
      expect(gulp.tasks.task1.dep).to.be.eql([]);
      expect(gulp.tasks.task2.name).to.be('task2');
      expect(gulp.tasks.task2.dep).to.be.eql(['task1']);
      expect(gulp.tasks['third-task'].name).to.be('third-task');
      expect(gulp.tasks['third-task'].dep).to.be.eql(['task2']);
      expect(gulp.tasks.task4.name).to.be('task4');
      expect(gulp.tasks.task4.dep).to.be.eql([]);
      expect(gulp.tasks['task4.watch'].name).to.be('task4.watch');
      expect(gulp.tasks['task4.watch'].dep).to.be.eql(['task4']);
    });

    it('should take in options', function () {
      var gulp = taskMaster({
        dirname: 'fixtures',
        pattern: '*.js',
        cwd: __dirname,
        watchExt: '-watch'
      });
      expect(gulp.Gulp).to.be(Gulp);
      expect(gulp.tasks).to.have.keys(
        'task1',
        'task2',
        'third-task',
        'task4',
        'task4-watch'
      );
    });

  });

});