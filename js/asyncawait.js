/**
 * 使用 Generator 与 Promise 模拟实现 async/await
 */

function myAsync(task) {
    const gen = task();

    return new Promise((resolve, reject) => {

        function runner(data) {
            let nextObj;
            try {
                nextObj = gen.next(data);
            } catch (err) {
                return reject(err);
            }
            if (nextObj.done) {
                return resolve(nextObj.value);
            }
            Promise.resolve(nextObj.value)
                .then(runner)
                .catch(reject);
        }

        runner();
    });
}

function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 5000, "this is data");
    });
}

function* task1() {
    console.log("task1: start...");
    yield sleep(5000);
    console.log("task1: done sleep, now fetch data...");
    const data = yield fetchData();
    console.log("task1:", data);
    return "this is end";
}

myAsync(task1)
    .then((data) => console.log("task1:", data));

function* task2() {
    console.log("task2: start...");
    yield Promise.reject("this is an error");
    console.log("task2: end...");
}

myAsync(task2)
    .catch((err) => console.log("task2:", err));

function* task3() {
    console.log("task3: start...");
    throw "this is an error";
}

myAsync(task3)
    .catch((err) => console.log("task3:", err));