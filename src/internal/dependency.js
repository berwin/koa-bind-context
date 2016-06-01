/**!
 * Koa-bind-context - src/internal/dependency.js
 *
 * Processing User modules dependency
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com> (https://github.com/berwin)
 */

'use strict';

module.exports = function (BindContext) {
  var bc = BindContext.prototype;

  /**
   * 获取 依赖 和 入口文件 抛出的exports对象
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