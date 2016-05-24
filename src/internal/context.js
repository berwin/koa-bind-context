/**!
 * Koa-bind-context - src/internal/context.js
 *
 * Processing Context
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

  /**
   * Initialize a new context.
   *
   * @api private
   */

  bc._createContext = function () {
    var context = {};
    var _modules = this._modules;
    var _entrance = this._entrance;

    context[_entrance.name] = _entrance.module;

    for (var i = 0; i < _modules.length; i++) {
      context[_modules[i].name] = _modules[i].module;
    }

    return context;
  };

  /**
   * Bind a context.
   *
   * @api private
   */

  bc._bindContext = function (modules, context) {
    var toString = Object.prototype.toString;
    var modulesMixin = {};

    for (var i in modules) {
      modulesMixin[i] = bind(modules[i], context);
    }

    return modulesMixin;
  };
};


function bind(item, context) {
  var type = toString.call(item);

  if (type === '[object Object]') {
    item = util.mixin(item, context, true);
  }

  if (type === '[object Function]') {
    item = item.bind(context);
  }

  return item;
}