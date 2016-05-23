/**!
 * Koa-bind-context - src/internal/exports.js
 *
 * Simulation exports
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

/**
 * Module dependencies.
 */

var util = require('../util/index.js');

module.exports = function (BindContext) {
  var bc = BindContext.prototype;

  bc._exports = function () {
    var toString = Object.prototype.toString;
    var entranceModule = this._entrance.module;
    var type = toString.call(entranceModule);

    if (type === '[object Object]') {

      var _exports = {};

      for (var i in entranceModule) {
        _exports[i] = this._dispath(entranceModule[i]);
      }

      return _exports;
    }

    if (type === '[object Function]') {
      return this._dispath(this._entrance.module);
    }
  };

  bc._dispath = function (fn) {
    var self = this;

    return function *(next) {
      self._bindContext(this);
      var modules = self._createContext();
      var ctx = util.mixin(this, modules);

      if (fn.constructor.name === 'GeneratorFunction') {
        next = fn.call(ctx, next);
      } else {
        next = Promise.resolve(fn.call(ctx, next));
      }

      if (typeof next.next === 'function') {
        yield *next;
      } else {
        yield next;
      }
    }
  };
};