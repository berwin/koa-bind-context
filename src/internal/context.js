/**!
 * Koa-bind-context - src/internal/context.js
 *
 * Processing Context
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com> (https://github.com/berwin)
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
    var deps = mergeDependency(this._entrance, this._modules);
    var dependencyMixin = bindCtx(deps, context);
    var ctx = util.mixin(context, dependencyMixin);

    return ctx;
  };
};

/**
 * 整合依赖
 * 将 入口模块 和 其他依赖 模块整合
 *
 * @param {Object} 入口模块
 * @param {Array} 其他依赖列表
 * @return {Object} 返回一个新对象，包含 modules 和 entrance 的依赖对象
 * @api private
 */

function mergeDependency(entrance, modules) {
  var dependencies = {};

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

function bindCtx(dependencies, context) {

  /*
   * 注意！！
   * 
   * 先将context 绑定到依赖后，在对context做修改，因为是引用关系，所以绑定的context会同步到最新的，
   * 如果先将依赖填入context，后将context绑定到依赖，那么这个时候context中的依赖是旧依赖（绑定context之前的依赖）
   * 所以，顺序很重要
   */

  // 先将context绑定到依赖中
  var dependencyMixin = bind(dependencies, context);

  // 后将依赖填入context
  for (var j in dependencyMixin) {
    context[j] = dependencyMixin[j];
  }

  return dependencyMixin;
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
  var dependencyMixin = {};

  if (type === '[object Object]') {
    for (var i in item) {
      dependencyMixin[i] = bind(item[i], context);
    }
    return dependencyMixin;
  }

  if (type === '[object Function]' || type === '[object GeneratorFunction]') {
    return item.bind(context);
  }
}