const { isObject } = require("./utils");

function isFunction(f) {
  return typeof f === "function";
}

const STATE = Object.freeze({
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
});

class MyPromise {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("should be function");
    }

    this._data = null;
    this._state = STATE.PENDING;
    this._callbacks = [];

    const onFulfilled = (value) => this._transition(STATE.FULFILLED, value);
    const onRejected = (reason) => this._transition(STATE.REJECTED, reason);

    let called = false;

    const resolve = (value) => {
      if (called) {
        return;
      }
      called = true;
      this._resolve(this, value, onFulfilled, onRejected);
    };

    const reject = (reason) => {
      if (called) {
        return;
      }
      called = true;
      onRejected(reason);
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const callback = { onFulfilled, onRejected, resolve, reject };
      if (this._state === STATE.PENDING) {
        this._callbacks.push(callback);
      } else {
        queueMicrotask(() => this._handleCallback(callback));
      }
    });
  }

  _transition(state, data) {
    if (this._state !== STATE.PENDING) {
      return;
    }
    this._state = state;
    this._data = data;
    queueMicrotask(() => this._handleCallbacks());
  }

  _handleCallback(callback) {
    const { onFulfilled, onRejected, resolve, reject } = callback;
    try {
      if (this._state === STATE.FULFILLED) {
        isFunction(onFulfilled)
          ? resolve(onFulfilled(this._data))
          : resolve(this._data);
      } else if (this._state === STATE.REJECTED) {
        isFunction(onRejected)
          ? resolve(onRejected(this._data))
          : reject(this._data);
      }
    } catch (err) {
      reject(err);
    }
  }

  _handleCallbacks() {
    while (this._callbacks.length) {
      this._handleCallback(this._callbacks.shift());
    }
  }

  _resolve(promise, x, resolve, reject) {
    // 防止成环造成循环 promise 链
    if (x === promise) {
      reject(new TypeError("Chaining cycle detected for promise"));
      return;
    }

    if (x instanceof MyPromise) {
      x.then(resolve, reject);
      return;
    }

    // 处理 thenable
    if (isObject(x) || isFunction(x)) {
      try {
        const then = x.then;
        if (isFunction(then)) {
          new MyPromise(then.bind(x)).then(resolve, reject);
          return;
        }
      } catch (err) {
        reject(err);
        return;
      }
    }

    // 向下传递 x
    resolve(x);
  }

  static resolve(value) {}

  static reject(reason) {}

  static all(promises) {}
}

module.exports = MyPromise;
