/**!
 * Koa-bind-context - src/context/index.js
 *
 * Processing dependency and context
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
   * Set the modules dependencies so that the modules can access the context
   */

  bc.config = function (config) {
    this._getDeps(config);
  };

  /**
   * Get the modules dependencies
   */

  bc._getDeps = function (config) {
    config = config || {};

    var contexts = config.context;
    var main = config.main;

    if (contexts) {
      for (var i in contexts) {
        this._modules.push({
          name: i,
          module: this._parent.require(contexts[i])
        });
      }
    }

    if (main) {
      for (var j in main) {
        this._entrance = {
          name: j,
          module: this._parent.require(main[j])
        }
      }
    }
  };

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

  bc._bindContext = function (context) {
    var toString = Object.prototype.toString;

    this._modules.forEach(bind);
    bind(this._entrance);

    function bind(item) {
      var type = toString.call(item.module);
      if (type === '[object Object]') {
        item.module = util.mixin(context, item.module);
      }

      if (type === '[object Function]') {
        item.module = item.module.bind(context);
      }
    }
  };
}