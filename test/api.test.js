/**!
 * Koa-bind-context - test/api.test.js
 *
 * Unit test
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com> (https://github.com/berwin)
 */

'use strict';

/**
 * Module dependencies.
 */

var assert = require('assert');
var koaBindContext = require('../src/index.js');

describe('Koa-bind-context', function () {
  it('Create instance', function () {
    var instance = koaBindContext();
    assert.equal(instance.constructor === koaBindContext, true);
  });

  it('There are two methods, instance.config and instance.exports', function () {
    var instance = koaBindContext();
    assert.equal(
      toString.call(instance.config) === '[object Function]' &&
      toString.call(instance.exports) === '[object Function]',
      true
    );
  });

  it('instance.config Should receive a parameter', function () {
    var instance = koaBindContext();
    assert.equal(instance.config.length, 1);
  });

  it('instance.exports return api is the same as the entrance-controller', function () {
    var instance = koaBindContext();
    var optinos = {
      main: {
        testCtrl: './exports/controller.test.js'
      },
      context: {
        testService: './exports/service.test.js'
      }
    };

    instance.config(optinos);

    var exports = instance.exports();
    var testCtrl = require(optinos.main.testCtrl);
    assert.equal(toString.call(exports.test), toString.call(testCtrl.test));
  });

  it('Module dependencies should be able to access context: 1', function () {
    var instance = koaBindContext();
    instance.config({
      main: {
        testCtrl: './exports/controller.test.js'
      },
      context: {
        testService: './exports/service.test.js'
      }
    });
    var exports = instance.exports();
    var ctx = {testStr: 'test context'};
    var gen = exports.test.call(ctx);
    gen.next();
  });

  it('Module dependencies should be able to access context: 2', function () {
    var instance = koaBindContext();
    instance.config({
      main: {
        testCtrl: './exports/controller2.test.js'
      },
      context: {
        testService: './exports/service.test.js'
      }
    });
    var exports = instance.exports();
    var ctx = {testStr: 'test context'};
    var gen = exports.call(ctx);
    gen.next();
  });
});