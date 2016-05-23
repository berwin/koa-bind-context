/**!
 * Koa-bind-context - src/internal/context.js
 *
 * Processing Context
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

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
};