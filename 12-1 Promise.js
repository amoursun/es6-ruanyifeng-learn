// Promise 的含义
// Promise对象有以下两个特点:
// (1）对象的状态不受外界影响,Promise对象代表一个异步操作，
// 有三种状态：Pending（进行中）、Resolved（已完成，又称 Fulfilled）和Rejected（已失败）
// 只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
// (2)一旦状态改变，就不会再变，任何时候都可以得到这个结果。
// Promise对象的状态改变，只有两种可能：从Pending变为Resolved和从Pending变为Rejected。
// 只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果。
// 如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。
// 这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。
// Promise对象提供统一的接口，使得控制异步操作更加容易。
// (3)Promise也有一些缺点:
// 首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。
// 其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
// 第三，当处于Pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。




// Promise的基本用法 : ES6 规定，Promise对象是一个构造函数，用来生成Promise实例
// var promise = new Promise(function(resolve, reject) {
//     // ... some code
//     if (/* 异步操作成功 */){
//         resolve(value);
//     } else {
//         reject(error);
//     }
// });
// Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。
// 它们是两个函数，由 JavaScript 引擎提供，不用自己部署
// resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 Pending 变为 Resolved），
//                   在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
// reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 Pending 变为 Rejected），
//                   在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。
// Promise实例生成以后，可以用then方法分别指定Resolved状态和Reject状态的回调函数。
//     promise.then(function(value) {
//         // success
//     }, function(error) {
//         // failure
//     });
//     then方法可以接受两个回调函数作为参数。
//     第一个回调函数是Promise对象的状态变为Resolved时调用，
//     第二个回调函数是Promise对象的状态变为Rejected时调用。
//     其中，第二个函数是可选的，不一定要提供。
//     这两个函数都接受Promise对象传出的值作为参数。
// 1.Promise对象简单例子:
//     function timeout(ms) {
//         return new Promise((resolve, reject) => {
//                 setTimeout(resolve, ms, 'done');
//         });
//     }
//     timeout(100).then((value) => {
//         console.log(value);//done
//     });
//     timeout方法返回一个Promise实例，表示一段时间以后才会发生的结果。过了指定的时间（ms参数）以后，
//     Promise实例的状态变为Resolved，就会触发then方法绑定的回调函数。
// 2.Promise 新建后就会立即执行
//     let promise = new Promise(function(resolve, reject) {
//         console.log('Promise');
//         resolve();
//     });
//     promise.then(function() {
//         console.log('Resolved');
//     });
//     console.log('Hi!');
    // Promise
    // Hi!
    // Resolved
    // Promise 新建后立即执行，所以首先输出的是Promise。然后，then方法指定的回调函数，
    // 将在当前脚本所有同步任务执行完才会执行，所以Resolved最后输出
// 3.下面是异步加载图片的例子:
//     function loadImageAsync(url) {
//         return new Promise(function(resolve, reject) {
//             var image = new Image();
//
//             image.onload = function() {
//                 resolve(image);
//             };
//
//             image.onerror = function() {
//                 reject(new Error('Could not load image at ' + url));
//             };
//
//             image.src = url;
//         });
//     }
//     使用Promise包装了一个图片加载的异步操作。如果加载成功，就调用resolve方法，否则就调用reject方法
// 4.用Promise对象实现的 Ajax 操作的例子
//     var getJSON = function(url) {
//         var promise = new Promise(function(resolve, reject){
//             var client = new XMLHttpRequest();
//             client.open("GET", url);
//             client.onreadystatechange = handler;
//             client.responseType = "json";
//             client.setRequestHeader("Accept", "application/json");
//             client.send();
//
//             function handler() {
//                 if (this.readyState !== 4) {
//                     return;
//                 }
//                 if (this.status === 200) {
//                     resolve(this.response);
//                 } else {
//                     reject(new Error(this.statusText));
//                 }
//             };
//         });
//
//         return promise;
//     };
//     getJSON("/posts.json").then(function(json) {
//         console.log('Contents: ' + json);
//     }, function(error) {
//         console.error('出错了', error);
//     });
//     上面代码中，getJSON是对 XMLHttpRequest 对象的封装，用于发出一个针对 JSON 数据的 HTTP 请求，
//     并且返回一个Promise对象。需要注意的是，在getJSON内部，resolve函数和reject函数调用时，都带有参数
//     如果调用resolve函数和reject函数时带有参数，那么它们的参数会被传递给回调函数。
//     reject函数的参数通常是Error对象的实例，表示抛出的错误；
//     resolve函数的参数除了正常的值以外，还可能是另一个 Promise 实例，
//         表示异步操作的结果有可能是一个值，也有可能是另一个异步操作
//         var p1 = new Promise(function (resolve, reject) {
//             setTimeout(() => reject(new Error('fail')), 3000)
//         })
//         var p2 = new Promise(function (resolve, reject) {
//             setTimeout(() => resolve(p1), 1000)
//         })
//         p2.then(result => console.log(result))
//             .catch(error => console.log(error))
//         // Error: fail .......
//     p1和p2都是Promise的实例，但是p2的resolve方法将p1作为参数，即一个异步操作的结果是返回另一个异步操作
//     这时p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态。如果p1的状态是Pending，
//     那么p2的回调函数就会等待p1的状态改变；如果p1的状态已经是Resolved或者Rejected，那么p2的回调函数将会立刻执行
//     上面代码中，p1是一个Promise，3秒之后变为rejected。p2的状态在1秒之后改变，resolve方法返回的是p1。
//     由于p2返回的是另一个 Promise，导致p2自己的状态无效了，由p1的状态决定p2的状态。所以，后面的then语句都变成针对后者（p1）
//     又过了2秒，p1变为rejected，导致触发catch方法指定的回调函数


// 3.Promise.prototype.then()
// then方法是定义在原型对象Promise.prototype上的,作用是为 Promise 实例添加状态改变时的回调函数
// then方法的第一个参数是Resolved状态的回调函数，第二个参数（可选）是Rejected状态的回调函数
// then方法返回的是一个新的Promise实例,可以采用链式写法，即then方法后面再调用另一个then方法
// 第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数
//     getJSON("/post/1.json").then(
//         post => getJSON(post.commentURL)
//     ).then(
//         comments => console.log("Resolved: ", comments),
//         err => console.log("Rejected: ", err)
//     );


// 4.Promise.prototype.catch()
// Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数
// 一般来说,不要在then方法里面定义Reject状态的回调函数（即then的第二个参数），总是使用catch方法
//      //bad
//     promise
//         .then(function(data) {
//             // success
//         }, function(err) {
//             // error
//         });
//
//     // good
//     promise
//         .then(function(data) { //cb
//             // success
//         })
//         .catch(function(err) {
//             // error
//         });
// 第二种写法要好于第一种写法，理由是第二种写法可以捕获前面then方法执行中的错误，
// 也更接近同步的写法（try/catch）。因此，建议总是使用catch方法，而不使用then方法的第二个参数
// 如果没有使用catch方法指定错误处理的回调函数，Promise对象抛出的错误不会传递到外层代码，即不会有任何反应
//     var someAsyncThing = function() {
//         return new Promise(function(resolve, reject) {
//             // 下面一行会报错，因为x没有声明
//             resolve(x + 2);
//         });
//     };
//
//     someAsyncThing().then(function() {
//         return someOtherAsyncThing();
//     }).catch(function(error) {
//         console.log('oh no', error);
//         // 下面一行会报错，因为y没有声明
//         y + 2;
//     }).then(function() {
//         console.log('carry on');
//     });
//     // oh no [ReferenceError: x is not defined]
// 上面代码中，catch方法抛出一个错误，因为后面没有别的catch方法了，
// 导致这个错误不会被捕获，也不会传递到外层。如果改写一下，结果就不一样了。
//     someAsyncThing().then(function() {
//         return someOtherAsyncThing();
//     }).catch(function(error) {
//         console.log('oh no', error);
//         // 下面一行会报错，因为y没有声明
//         y + 2;
//     }).catch(function(error) {
//         console.log('carry on', error);
//     });
//     // oh no [ReferenceError: x is not defined]
//     // carry on [ReferenceError: y is not defined]
// 上面代码中，第二个catch方法用来捕获，前一个catch方法抛出的错误


// 5.Promise.all(): Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例
// var p = Promise.all([p1, p2, p3]);
// Promise.all方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例,如果不是，就会先调Promise.resolve方法，
// 将参数转为 Promise 实例，再进一步处理
// 1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
// 2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数
//     const databasePromise = connectDatabase();
//     const booksPromise = databasePromise
//         .then(findAllBooks);
//     const userPromise = databasePromise
//         .then(getCurrentUser);
//     Promise.all([
//         booksPromise,
//         userPromise
//     ])
//         .then(([books, user]) => pickTopRecommentations(books, user));
// booksPromise和userPromise是两个异步操作，只有等到它们的结果都返回了，才会触发pickTopRecommentations这个回调函数

// 如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法
//     const p1 = new Promise((resolve, reject) => {
//             resolve('hello');
//     })
//     .then(result => result)
//     .catch(e => e);
//
//     const p2 = new Promise((resolve, reject) => {
//             throw new Error('报错了');
//     })
//     .then(result => result)
//     .catch(e => e);
//
//     Promise.all([p1, p2])
//         .then(result => console.log(result))
//     .catch(e => console.log(e));
//     // ["hello", Error: 报错了]
// p1会resolved，p2首先会rejected，但是p2有自己的catch方法，该方法返回的是一个新的 Promise 实例，
// p2指向的实际上是这个实例该实例执行完catch方法后，也会变成resolved，导致Promise.all()方法参数里
// 面的两个实例都会resolved，因此会调用then方法指定的回调函数，而不会调用catch方法指定的回调函数
// 如果 p2没有自己的catch方法，就会调用Promise.all()的catch方法
//     const p1 = new Promise((resolve, reject) => {
//             resolve('hello');
//     })
//     .then(result => result)
//     .catch(e => e);
//
//     const p2 = new Promise((resolve, reject) => {
//             throw new Error('报错了');
//     })
//     .then(result => result);
//
//     Promise.all([p1, p2])
//         .then(result => console.log(result))
//         .catch(e => console.log(e));
//     // Error: 报错了


// 6.Promise.race() : Promise.race方法同样是将多个Promise实例，包装成一个新的Promise实例
// Promise.race方法的参数与Promise.all方法一样，如果不是 Promise 实例，就会先调用下面讲到的Promise.resolve方法，
// 将参数转为 Promise 实例，再进一步处理
// 但是: 只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数
//     const p = Promise.race([
//         fetch('/resource-that-may-take-a-while'),
//         new Promise(function (resolve, reject) {
//             setTimeout(() => reject(new Error('request timeout')), 5000)
//         })
//     ]);
//     p.then(response => console.log(response));
//     p.catch(error => console.log(error));
// 上面代码中，如果5秒之内fetch方法无法返回结果，变量p的状态就会变为rejected，从而触发catch方法指定的回调函数


// 7.Promise.resolve() : Promise.resolve方法将现有方法转为Promise对象
//     var jsPromise = Promise.resolve($.ajax('/whatever.json'));
//     上面代码将jQuery生成的deferred对象，转为一个新的Promise对象
// Promise.resolve('foo') === new Promise(resolve => resolve('foo')):Promise两种写法
// Promise.resolve方法的参数分成四种情况:
//     1）参数是一个Promise实例: Promise.resolve将不做任何修改、原封不动地返回这个实例
//     2）参数是一个thenable对象: thenable对象指的是具有then方法的对象
//                      Promise.resolve方法会将这个对象转为Promise对象，然后就立即执行thenable对象的then方法
//             let thenable = {
//                 then: function(resolve, reject) {
//                     resolve(42);
//                 }
//             };
//             let p1 = Promise.resolve(thenable);
//             p1.then(function(value) {
//                 console.log(value);  // 42
//             });// thenable对象的then方法执行后，对象p1的状态就变为resolved,立即执行最后那个then方法指定的回调函数，输出42
//     3）参数不是具有then方法的对象，或根本就不是对象: Promise.resolve方法返回一个新的Promise对象，状态为Resolved
//             var p = Promise.resolve('Hello');
//             p.then(function (s){
//                 console.log(s)
//             });
//             // Hello
// 生成一个新的Promise对象的实例p。由于字符串Hello不属于异步操作，返回Promise实例的状态从一生成就是Resolved，所以回调函数会立即执行。
// Promise.resolve方法的参数，会同时传给回调函数
//     4) 不带有任何参数: Promise.resolve方法允许调用时不带参数，直接返回一个Resolved状态的Promise对象
//         var p = Promise.resolve();p.then(function () {// ...});//变量p就是一个Promise对象
//      注意:立即resolve的Promise对象，是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时
//             setTimeout(function () {
//                 console.log('three');
//             }, 0);
//             Promise.resolve().then(function () {
//                 console.log('two');
//             });
//             console.log('one');
//             // one
//             // two
//             // three
//         // setTimeout(fn, 0)在下一轮“事件循环”开始时执行，
//         // Promise.resolve()在本轮“事件循环”结束时执行，
//         // console.log('one')则是立即执行，因此最先输出


// 8) Promise.reject() : Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。
//         var p = Promise.reject('出错了');
//         // 等同于
//         var p = new Promise((resolve, reject) => reject('出错了'))
//         p.then(null, function (s) {
//             console.log(s)
//         });
//         // 出错了
// 注意: Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。
//      这一点与Promise.resolve方法不一致。
//         const thenable = {
//             then(resolve, reject) {
//                 reject('出错了');
//             }
//         };
//         Promise.reject(thenable)
//             .catch(e => {
//             console.log(e === thenable)
//         })
//         // true
// Promise.reject方法的参数是一个thenable对象，执行以后，
// 后面catch方法的参数不是reject抛出的“出错了”这个字符串， 而是thenable对象


// 9) 两个有用的附加方法: 1. done()     2. finally()
//     1. then方法或catch方法结尾，要是最后一个方法抛出错误，
//     都有可能无法捕捉到（因为Promise内部的错误不会冒泡到全局）。
//     因此，我们可以提供一个done方法，总是处于回调链的尾端，保证抛出任何可能出现的错误
//          asyncFunc().then(f1).catch(r1).then(f2).done();// done都会捕捉到任何可能出现的错误，并向全局抛出
//     2.不管Promise对象最后状态如何，都会执行的操作。它与done方法的最大区别，
//     它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行
//         server.listen(0)
//             .then(function () {
//                 // run test
//             })
//             .finally(server.stop);//服务器使用Promise处理请求，然后使用finally方法关掉服务器


// (10) Promise应用: 加载图片     Generator函数与Promise的结合 具体看es6
// (11) Promise.try() : 不用区分同步或者异步,同步则同步执行,异步则异步执行处理,以下两方法也同样作用
//             (async () => f())()
//                 .then(...)
//                 .catch(...)
//                 const f = () => console.log('now');

//         (
//             () => new Promise(
//             resolve => resolve(f())
//         )
//         )();
//         console.log('next');
//         // now
//         // next
//         上面代码也是使用立即执行的匿名函数，执行new Promise()。这种情况下，同步函数也是同步执行的










































