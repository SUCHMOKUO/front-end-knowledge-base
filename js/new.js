function A(n) {
  this.a = n;
  return null;
}

const a = new A(12);

function myNew(clazz, ...args) {
  const obj = new Object;

  // set prototype.
  const clazzProto = clazz.prototype;
  const proto = clazzProto instanceof Object
    ? clazz.prototype
    : Object.prototype;
  Reflect.setPrototypeOf(obj, proto);

  // apply constructor.
  const ret = clazz.apply(obj, args);

  // return.
  return ret instanceof Object ? ret : obj;
}

const b = myNew(A, 23);

console.log(a, b);