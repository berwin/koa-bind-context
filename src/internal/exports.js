/**!
 * Koa-bind-context - src/internal/exports.js
 *
 * Simulation exports
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com> (https://github.com/berwin)
 */

'use strict';

/**
 * Module dependencies.
 */

var util = require('../util/index.js');

module.exports = function (BindContext) {
  var bc = BindContext.prototype;

  /*
   * 暴露api
   * 针对入口文件（config.main这个模块）抛出的方法进行模拟，并抛出具有相同方法的api
   * 不同的是，外界操作所抛出的方法时，咱们会做一些处理（绑定上下文），然后在执行入口文件所抛出的方法
   * 
   * @return {Object || Function}
   */
  bc._exports = function () {
    var toString = Object.prototype.toString;
    var entranceModule = this._entrance.module;
    var type = toString.call(entranceModule);

    if (type === '[object Object]') {
      var exports = {};
      for (var i in entranceModule) {
        exports[i] = this._dispath(entranceModule[i]);
      }
      return exports;
    }

    if (type === '[object Function]' || type === '[object GeneratorFunction]') {
      return this._dispath(this._entrance.module);
    }
  };

  /*
   * 返回一个中间件
   * 执行中间件将会把上下文绑定到依赖抛出的方法，并且执行该方法
   * 
   * @return {Function}
   * @api private
   */

  bc._dispath = function (fn) {
    var self = this;

    return function *(next) {
      var ctx = self._createContext(this);

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