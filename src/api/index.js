/**!
 * Koa-bind-context - src/api/index.js
 *
 * Exposed Api
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

module.exports = function (BindContext) {
  var bc = BindContext.prototype;

  /**
   * Set the modules dependencies so that the modules can access the context
   */

  bc.config = function (config) {
    this._getDependencies(config);
  };

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

    return function *() {
      this.body = 'hello world~';
    };
  };
}