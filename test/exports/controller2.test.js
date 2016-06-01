/**!
 * Koa-bind-context - test/exports/controller2.test.js
 *
 * Unit test
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com> (https://github.com/berwin)
 */

'use strict';

module.exports = function *() {
  var result = yield *this.testService.test();
  if (result !== 'test context') throw new Error('Module dependencies can`t be able to access context')
};