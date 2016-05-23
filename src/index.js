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

/**
 * Module dependencies.
 */

var contextMixin = require('./internal/context.js');
var dependencyMixin = require('./internal/dependency.js');
var exportsMixin = require('./internal/exports.js');

var apiMixin = require('./api/index.js');

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

// install internals
dependencyMixin(BindContext);
contextMixin(BindContext);
exportsMixin(BindContext);

// install APIs
apiMixin(BindContext);

module.exports = BindContext;