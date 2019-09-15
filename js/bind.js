Function.prototype.bind2 = function(ctx, ...args) {
  const fn = this;

  if (typeof fn !== "function") {
    throw new TypeError("Bind must be called on a function");
  }

  function bound(...boundArgs) {
    if (new.target === bound) {
      // call with new.
      return new fn(...boundArgs);
    }
    return fn.call(ctx, ...args, ...boundArgs);
  }

  return bound;
}

function add(a, b) {
  console.log(this);
  return a + b;
}

const add2 = add.bind2({ name: "ctx" }, 2);
const A = Array.bind2(null);
console.log(add2(1), new A(1, 2, 3));