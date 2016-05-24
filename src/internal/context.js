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
   * 整合依赖
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
    var toString = Object.prototype.toString;
    var dependencyMixin = {};

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