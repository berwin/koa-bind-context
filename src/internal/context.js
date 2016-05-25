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

  /*
   * 创建上下文
   * 
   * @param {Context} koa中的上下文
   * @return {Context} 返回附加了各种信息的上下文
   * @api private
   */

  bc._createContext = function (context) {
    var deps = this._mergeDependency();
    var dependencyMixin = this._bindContext(deps, context);
    var ctx = util.mixin(context, dependencyMixin);

    return ctx;
  };

  /**
   * 整合依赖
   * 将 入口模块 和 其他依赖 模块整合
   *
   * @return {Object} 返回一个新对象，包含 modules 和 entrance 的依赖对象
   * @api private
   */

  bc._mergeDependency = function () {
    var dependencies = {};
    var modules = this._modules;
    var entrance = this._entrance;

    dependencies[entrance.name] = entrance.module;
    for (var i = 0; i < modules.length; i++) {
      dependencies[modules[i].name] = modules[i].module;
    }

    return dependencies;
  };

  /**
   * 绑定上下文
   * 将所有的依赖绑定context，返回绑定后的依赖对象
   *
   * @return {Object} 依赖对象
   * @api private
   */

  bc._bindContext = function (dependencies, context) {
    var dependencyMixin = {};

    // 先将依赖都填入上下文
    for (var j in dependencies) {
      context[j] = dependencies[j];
    }

    // 后将上下文填入依赖
    for (var i in dependencies) {
      dependencyMixin[i] = bind(dependencies[i], context);
    }

    return dependencyMixin;
  };
};


/*
 * 绑定上下文
 * 将context绑定到item中
 *
 * @param {Object||Function} 模块导出的方法
 * @param {Object} 上下文
 * @return {Object||Function} 返回绑定context后的item
 * @api private
 */
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