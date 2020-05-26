/**
 * 非严格模式实现
 * 无法实现：
 *   1. 严格模式下 this 不做额外处理，可以是非对象
 *   2. ctx 被 freeze 了，无法使用添加属性的办法使得函数获得 this
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