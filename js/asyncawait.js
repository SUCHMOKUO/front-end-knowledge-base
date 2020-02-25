/**
 * 使用 Generator 与 Promise 模拟实现 async/await
 */
function myAsync(task) {
    const gen = task();

    function runner(data) {
        const nextObj = gen.next(data);
        if (nextObj.done || !(nextObj.value instanceof Promise)) {
            return;
        }
        nextObj.value.then(runner);
    }

    runner();
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

function* task() {
    console.log("start...");
    yield sleep(5000);
    console.log("done sleep, now fetch data...");
    const data = yield fetchData();
    console.log("data:", data);
    console.log("end...");
}

myAsync(task);
