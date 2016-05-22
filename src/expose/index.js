/**!
 * Koa-bind-context - src/context/index.js
 *
 * Exposed interface
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
   * Expose `dispatch`.
   */

  bc.dispatch = function () {
    var self = this;
    var toString = Object.prototype.toString;
    var type = toString.call(this._entrance.module);
    var expose = null;

    if (type === '[object Object]') {
      
    }

    if (type === '[object Function]') {}

    return function *() {};



    /*return function *(next) {
      self._bindContext(this);
      var ctx = self._createContext();
      ctx = util.mixin(this, ctx);

      // console.log(ctx);

      // next = self._entrance.module;

      if (typeof next.next === 'function') {
        yield *next;
      } else {
        yield next;
      }
    }*/
  };
}