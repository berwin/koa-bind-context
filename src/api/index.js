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
   * Expose `exports`.
   */
  bc.exports = function () {
    return this._exports();
  };
}