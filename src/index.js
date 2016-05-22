/**!
 * Koa-bind-context - src/index.js
 *
 * Bind the koa-context to the project module
 * Entry file
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var contextMixin = require('./context/index.js');
var exposeMixin = require('./expose/index.js');

/**
 * Create a new bindContext.
 */

function BindContext () {
  if (!(this instanceof BindContext)) {
    return new BindContext();
  }

  this._modules = [];
  this._entrance = {};
  this._parent = module.parent;
}

contextMixin(BindContext);
exposeMixin(BindContext);

module.exports = BindContext;