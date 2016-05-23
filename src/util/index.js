/**!
 * Koa-bind-context - src/util/index.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

/*
 * Copy src to target
 * 
 * @param {Object} target
 * @param {Object} src
 * @param {Boolean} Whether to replace default is false
 */
exports.mixin = function(dest, src, redefine) {
  var toString = Object.prototype.toString;

  if (!dest) throw new TypeError('argument dest is required');
  if (!src) throw new TypeError('argument src is required');
  if (toString.call(src) !== '[object Object]') throw new TypeError('argument src is not correct');

  for (var i in src) {
    if (dest[i] === undefined || redefine === true) {
      dest[i] = src[i];
    }
  }

  return dest;
};