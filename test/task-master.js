'use strict';
/* jshint maxlen: false */

var expect     = require('chai').expect;
var fs         = require('fs');
var path       = require('path');
var taskMaster = require('../');
var gulp       = require('gulp');
var Gulp       = require('gulp').Gulp;


describe('gulp-task-master', function () {

  afterEach(function () {
    gulp.tasks = {};
  });

  it('should grab all of the included modules', function () {
    /* jshint maxstatements: false */
    var gulp = taskMaster('test/fixtures/tasks');
    expect(gulp.Gulp).to.be.equal(Gulp);
    expect(gulp.tasks).to.have.keys(
      'task1',
      'task2',
      'third-task',
      'task4',
      'task4.watch',
      'task5'
    );
    expect(gulp.tasks.task1.name).to.be.equal('task1');
    expect(gulp.tasks.task1.dep).to.be.eql([]);
    expect(gulp.tasks.task2.name).to.be.equal('task2');
    expect(gulp.tasks.task2.dep).to.be.eql(['task1']);
    expect(gulp.tasks['third-task'].name).to.be.equal('third-task');
    expect(gulp.tasks['third-task'].dep).to.be.eql(['task2']);
    expect(gulp.tasks.task4.name).to.be.equal('task4');
    expect(gulp.tasks.task4.dep).to.be.eql([]);
    expect(gulp.tasks['task4.watch'].name).to.be.equal('task4.watch');
    expect(gulp.tasks['task4.watch'].dep).to.be.eql(['task4']);
    expect(gulp.tasks.task5.name).to.be.equal('task5');
    expect(gulp.tasks.task5.dep).to.be.eql(['task1', 'task2']);
  });

  it('should take in options', function () {
    var gulp = taskMaster({
      dirname: 'fixtures',
      pattern: 'tasks/*.js',
      cwd: __dirname,
      watchExt: '-watch'
    });
    expect(gulp.Gulp).to.be.equal(Gulp);
    expect(gulp.tasks).to.have.all.keys(
      'task1',
      'task2',
      'third-task',
      'task4',
      'task4-watch',
      'task5'
    );
  });

  it('should run watch tasks', function () {
    var gulp = taskMaster('test/fixtures/tasks');
    var output = [];
    console.testLog = function (input) {
      output.push(input);
    };
    gulp.start('task4.watch');
    expect(output).to.be.eql(['ran watcher']);
  });

  it('should run dependencies if dependency only task is specified', function () {
    var gulp = taskMaster('test/fixtures/tasks');
    var output = [];
    console.testLog = function (input) {
      output.push(input);
    };
    gulp.start('task5');
    expect(output).to.contain('ran task1', 'ran task2');
  });

});
