function throttle(fn, delay) {
  let lastCallTime = new Date(0);

  return (...args) => {
    const time = new Date();
    if (time - lastCallTime > delay) {
      lastCallTime = time;
      return fn(...args);
    }
  };
}

const hello = throttle(() => {
  console.log("hello");
}, 500);

let i = 50;

function t() {
  setTimeout(() => {
    if (--i > 0) {
      console.log("called hello");
      hello();
      t();
    } else {
      console.log("call hello after 1000ms");
      setTimeout(() => {
        hello();
      }, 1000);
    }
  }, 100);
}

t();
