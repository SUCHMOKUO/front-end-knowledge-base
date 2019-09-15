/**
 * 非严格模式实现
 */
Function.prototype.call2 = function(ctx, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("should be function");
  }

  if (ctx === null || ctx === undefined) {
    ctx = (function() { return this; })();
  } else {
    ctx = Object(ctx);
  }

  const fnName = Symbol();
  Reflect.defineProperty(ctx, fnName, {
    enumerable: false,
    configurable: true,
    value: this
  });
  const res = ctx[fnName](...args);
  Reflect.deleteProperty(ctx, fnName);
  return res;
}

function t(a, b, c) {
  console.log(this);
  console.log(this.name, a, b, c);
}

const ctx = { name: "mokuo" };
t.call2(ctx, 1, 2, 3);

global.name = "global name";
t.call2(null, 4, 5, 6);