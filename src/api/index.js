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
   * 设置模块的依赖关系，使所有配置中的模块都可以访问上下文
   *
   * @例子
   *
   * project - controllers/user/index.js
   *
   * ```javascript
   * koaBindContext.config({
   *   main: {
   *     controller: './user.js'
   *   },
   *   context: {
   *     service: '../../service/user/index.js',
   *     proxy: '../../proxy/user/index.js'
   *   }
   * });
   * ```
   *
   * 上面的例子中，'../../service/user/index.js'，'../../proxy/user/index.js'，controllers/user/user.js 这三个文件共用同一个context
   *
   * @param {Object} config 配置文件有两个必填字段 main 与 context 
   * @param {Object} config.main 必选 自定义 key 与 value
   * @param {Object} config.main key 可以在 context 中通过这个 key 来读取对应的模块
   * @param {Object} config.main value 配置模块地址，根据模块路径把模块抛出的内容填入 context
   * @param {Object} context 与main同理，不同的是，所有需要绑定上下文的模块都需要在context中配置，main只能配置一个文件
   */

  bc.config = function (config) {
    this._getDependencies(config);
  };

  /**
   * 暴露出口
   * 模拟“入口”抛出的API，使其暴露的 API 与 config中配置的 main 入口文件中所抛出的接口一模一样~
   *
   * @例子
   *
   * project - controllers/user/index.js
   *
   * ```javascript
   * koaBindContext.exports();
   * ```
   *
   * @return {Object || Function || Other} 返回内容与入口文件的 module.exports 相同~
   */
  bc.exports = function () {
    return this._exports();
  };
}