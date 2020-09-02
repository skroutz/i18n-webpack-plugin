var p = __('test');
var n1 = n__('test with n', 'test with ns', 1);
var nm = n__('test with n', 'test with ns', 2);
var s = s__('test|hey');

var ep = __('empty');
var en1 = n__('empty with n', 'empty with ns', 1);
var enm = n__('empty with n', 'empty with ns', 2);
var es = s__('empty|hey');

var n = __('yada');

module.exports = {
  p: p,
  n1: n1,
  nm: nm,
  s: s,
  ep: ep,
  en1: en1,
  enm: enm,
  es: es,
  n: n,
};
