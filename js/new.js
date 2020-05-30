const { isObject } = require("./utils");

function A(n) {
  this.a = n;
  return null;
}

const a = new A(12);

function myNew(clazz, ...args) {
  // set prototype.
  const clazzProto = clazz.prototype;
  const proto = isObject(clazzProto) ? clazzProto : Object.prototype;

  const obj = Object.create(proto);

  // apply constructor.
  const ret = clazz.apply(obj, args);

  // return.
  return isObject(ret) ? ret : obj;
}

const b = myNew(A, 23);

console.log(a, b);
