/**!
 * Koa-bind-context - src/internal/dependency.js
 *
 * Processing User modules dependency
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

module.exports = function (BindContext) {
  var bc = BindContext.prototype;

  /**
   * Get the modules dependencies
   *
   * @api private
   */

  bc._getDependencies = function (config) {
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
};