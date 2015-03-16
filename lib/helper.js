function arrayEqual(a, b) {
  var i = Math.max(a.length, b.length, 1);
  while(i-- >= 0 && a[i] === b[i]);
  return (i === -2);
}

export var flatten = function(array) {
  var r = [];
  
  while (!arrayEqual(r, array)) {
    r     = array;
    array = Array.prototype.concat.apply([], array);
  }
  return array;
};