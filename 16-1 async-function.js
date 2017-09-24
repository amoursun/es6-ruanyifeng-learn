// async函数: Generator的语法糖
// 例子: Generator函数依次读取两个文件
//     var fs = require('fs');
//     var readFile = function (fileName) {
//         return new Promise(function(resolve, reject) {
//             fs.readFile(fileName,function(error, data) {
//                 if (error) {
//                     reject(error);
//                 }
//                 resolve(data);
//             });
//         });
//     };
    // var gen = function* () {
    //     var f1 = yield readFile('/etc/fstab');
    //     var f2 = yield readFile('/etc/shells');
    //     console.log(f1.toString());
    //     console.log(f2.toString());
    // };
    // var g = gen();
    // g.next();
//下面写成async函数
//     var asyncReadFile = async function() {
//         var f1 = await readFile('/etc/fstab');
//         var f2 = await readFile('/etc/shells');
//         console.log(f1.toString());
//         console.log(f2.toString());
//     }
//     var result = asyncReadFile();
// 将Generator函数中的* 替换成 async,  yield 替换成 await

// async函数 对Generator函数的改进,以下四点:
// (1) 内置执行器 :Generator 函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器
// async函数的执行 : var result = asyncReadFile();//自动执行
// Generator 函数 : 需要调用next方法，或者用co模块，才能真正执行
// (2) 更好的语义
// async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果
// (3）更广的适用性
// co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，
// 而async函数的await命令后面，可以是Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）
// (4）返回值是 Promise
// async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用then方法指定下一步的操作

// 2. async函数用法
// sync函数返回一个 Promise 对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到await就会先返回，
// 等到异步操作完成，再接着执行函数体内后面的语句
//     async function getStockPriceByName(name) {
//         var symbol = await getStockSymbol(name);
//         var stockPrice = await getStockPrice(symbol);
//         return stockPrice;
//     }
//     getStockPriceByName('goog').then(function (result) {
//         console.log(result);
//     });

//指定多少时间后输出
//         function timeout(ms) {
//             return new Promise((resolve) => {//也可以 await new Promise(...(不变))
//                     setTimeout(resolve, ms);
//             });
//         }
//         async function asyncPrint(value, ms) {
//             await timeout(ms);
//             console.log(value);
//         }
//         asyncPrint('hello world', 50);
//         上面代码指定50毫秒以后，输出hello world

// async 函数有多种使用形式。
//         // 函数声明
//         async function foo() {}
//
//         // 函数表达式
//         const foo = async function () {};
//
//         // 对象的方法
//         let obj = { async foo() {} };
//         obj.foo().then(...)
//
//         // Class 的方法
//         class Storage {
//             constructor() {
//                 this.cachePromise = caches.open('avatars');
//             }
//
//             async getAvatar(name) {
//                 const cache = await this.cachePromise;
//                 return cache.match(`/avatars/${name}.jpg`);
//             }
//         }
//         const storage = new Storage();
//         storage.getAvatar('jake').then(…);
//
//         // 箭头函数
//         const foo = async () => {};



// 3. 语法
// async函数的语法规则总体上比较简单，难点是错误处理机制
// 3.1 返回 Promise 对象
// async函数返回一个 Promise 对象,内部return语句返回的值，会成为then方法回调函数的参数,
// async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态。抛出的错误对象会被catch方法回调函数接收到
//     async function f() {
//         return '哈哈啊哈哈哈';
//     }
//     f().then(v => console.log(v));//'哈哈啊哈哈哈'
//     async function f() {
//         throw new Error('错误');
//     }
//     f().then(v => console.log(v), e => console.log(e));//Error : 错误
// 3.2 Promise 对象的状态变化
// async函数返回的 Promise 对象，必须等到内部所有await命令后面的 Promise 对象执行完，才会发生状态改变，
// 除非遇到return语句或者抛出错误,才会执行then方法指定的回调函数
// 3.3 await 命令
// 正常下，await命令后面是一个 Promise 对象。如果不是，会被转成一个立即resolve的 Promise 对象。
//     async function f() {
//         return await 123;
//     }
//     f().then(v => console.log(v))// 123
// await命令后面的 Promise 对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到
//     async function f() {await Promise.reject('出错了');}//await 前加上 return 效果一样
//     f().then(v => console.log(v), e => console.log(e));//出错了
// 只要一个await语句后面的 Promise 变为reject，那么整个async函数都会中断执行,
// 一方法可以将第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行
// 另一种方法是await后面的 Promise 对象再跟一个catch方法，处理前面可能出现的错误
// 3.4 错误处理
// 如果await后面的异步操作出错，那么等同于async函数返回的 Promise 对象被reject,导致catch方法的回调函数被调用
// 多个await命令，可以统一放在try...catch结构中
//      使用try...catch结构，实现多次重复尝试:
//     const superagent = require('superagent');
//     const NUM_RETRIES = 3;
//     async function test() {
//         let i;
//         for (i = 0; i < NUM_RETRIES; ++i) {
//             try {
//                 await superagent.get('http://google.com/this-throws-an-error');
//                 break;
//             } catch(err) {}
//         }
//         console.log(i); // 3
//     }
//     test();
//     上面代码中，如果await操作成功，就会使用break语句退出循环；如果失败，会被catch语句捕捉，然后进入下一轮循环
// 3.5 使用注意点
// 3.5.1 await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中
// 3.5.2 多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发
//         // 写法一
//         let [foo, bar] = await Promise.all([getFoo(), getBar()]);
//         // 写法二
//         let fooPromise = getFoo();
//         let barPromise = getBar();
//         let foo = await fooPromise;
//         let bar = await barPromise;
//         上面两种写法，getFoo和getBar都是同时触发，这样就会缩短程序的执行时间。
//         下面方法就继发费时:
//         let foo = await getFoo();
//         let bar = await getBar();
// 3.5.3 await命令只能用在async函数之中，如果用在普通函数，就会报错
// 3.5.4 如果确实希望多个请求并发执行，可以使用Promise.all方法。当三个请求都会resolved时
//         async function dbFuc(db) {
//             let docs = [{}, {}, {}];
//             let promises = docs.map((doc) => db.post(doc));
//
//             let results = await Promise.all(promises);
//             console.log(results);
//         }
//         // 或者使用下面的写法
//         async function dbFuc(db) {
//             let docs = [{}, {}, {}];
//             let promises = docs.map((doc) => db.post(doc));
//
//             let results = [];
//             for (let promise of promises) {
//                 results.push(await promise);
//             }
//             console.log(results);
//         }

// 4. async 函数的实现原理: 将 Generator 函数和自动执行器，包装在一个函数里
// 5. 与其他异步处理方法的比较
// 6. 按顺序完成异步操作
// 例如: 依次远程读取一组 URL，然后按照读取的顺序输出结果
// Promise 的写法如下:
//         function logInOrder(urls) {
//             // 远程读取所有URL
//             const textPromises = urls.map(url => {
//                     return fetch(url).then(response => response.text());
//              });
//             // 按次序输出
//             textPromises.reduce((chain, textPromise) => {
//                 return chain.then(() => textPromise)
//              .then(text => console.log(text));
//              }, Promise.resolve());
//         }
// async 函数实现:
//         async function logInOrder(urls) {
//             for (const url of urls) {
//                 const response = await fetch(url);
//                 console.log(await response.text());
//             }
//         }
//         // 上面代码确实大大简化，问题是所有远程操作都是继发,效率非常差
//         async function logInOrder(urls) {
//             // 并发读取远程URL
//             const textPromises = urls.map(async url => {
//                 const response = await fetch(url);
//                 return response.text();
//             });
//
//             // 按次序输出
//             for (const textPromise of textPromises) {
//                 console.log(await textPromise);
//             }
//         }
//         map方法的参数是async函数，但它是并发执行的，因为只有async函数内部是继发执行，外部不受影响。
//         后面的for..of循环内部使用了await，因此实现了按顺序输出

// 7. 异步遍历器
// 7.1 异步遍历器接口
// 对象的同步遍历器接口，部署在Symbol.terator属性上面,
// 对象的异步遍历器接口，部署在Symbol.asyncIterator属性上面,
// 只要它的Symbol.asyncIterator属性有值，就表示应该对它进行异步遍历
// 7.2 for await...of
//     for...of 遍历同步Iterator接口,for await...of循环，则是用于遍历异步的 Iterator 接口
//      写法: for await (let v of createAsyncIterable(['a', 'b']))
//     async function f() {
//         for await (const x of createAsyncIterable(['a', 'b'])) {
//             console.log(x);
//         }
//     }
//     // a
//     // b
//     createAsyncIterable()返回一个异步遍历器，for...of循环自动调用这个遍历器的next方法，会得到一个Promise对象。
//     await用来处理这个Promise对象，一旦resolve，就把得到的值（x）传入for...of的循环体
// 如果next方法返回的 Promise 对象被reject，for await...of就会报错，要用try...catch捕捉
//     async function () {
//         try {
//             for await (const x of createRejectingIterable()) {
//                 console.log(x);
//             }
//         } catch (e) {
//             console.error(e);
//         }
//     }
// 7.3 异步 Generator 函数 : Generator 函数 分 同步和异步
//   Generator 函数(同步)返回一个同步遍历器对象一样，
//   异步 Generator 函数的作用，是返回一个异步遍历器对象,
//   异步 Generator 函数就是async函数与 Generator 函数的结合
//         async function* gen() {//异步Generator函数
//             yield 'hello';
//         }
//         const genObj = gen();
//         genObj.next().then(x => console.log(x));
//         // { value: 'hello', done: false }
// 异步 Generator 函数内部，能够同时使用await和yield命令。可以这样理解，
// await命令用于将外部操作产生的值输入函数内部，yield命令用于将函数内部的值输出
// 异步 Generator 函数可以与for await...of循环结合起来使用
//     async function* readLines(path) {
//         let file = await fileOpen(path);
//
//         try {
//             while (!file.EOF) {
//                 yield await file.readLine();
//             }
//         } finally {
//             await file.close();
//         }
//     }
//     异步操作前面使用await关键字标明，即await后面的操作，应该返回 Promise 对象。
//     凡是使用yield关键字的地方，就是next方法的停下来的地方，它后面的表达式的值（即await file.readLine()的值),
//     会作为next()返回对象的value属性，这一点是与同步 Generator 函数一致的
// 异步 Generator 函数抛出错误，会被 Promise 对象reject，然后抛出的错误被catch方法捕获








































