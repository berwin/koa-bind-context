module.exports = function *() {
  var result = yield *this.testService.test();

  if (result !== 'test context') throw new Error('Module dependencies can`t be able to access context')
};