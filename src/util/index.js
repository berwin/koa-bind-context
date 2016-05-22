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
}