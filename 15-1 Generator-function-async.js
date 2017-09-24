// Generator 函数的异步应用
// es5异步编程方法:
//         回调函数
//         事件监听
//         发布/订阅
//         Promise 对象
// es6:
//     Generator 函数
// (1) 回调函数 callback :  回调函数本身并没有问题，它的问题出现在多个回调函数嵌套
//         //读取文件进行处理，是这样写的
//         fs.readFile('/etc/passwd', 'utf-8', function (err, data) {
//             if (err) throw err;
//             console.log(data);
//         });//操作系统返回了/etc/passwd这个文件以后，回调函数才会执行
//      //why回调函数的第一个参数，必须是错误对象err: 原因是执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。
//                                             在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段
// (2) Promise : Promise 对象就是为了解决多层嵌套混乱问题 => 将回调函数的嵌套，改成链式调用
//        //连续读取多个文件写法:
//         var readFile = require('fs-readfile-promise');
//         readFile(fileA)
//             .then(function (data) {
//                 console.log(data.toString());
//             })
//             .then(function () {
//                 return readFile(fileB);
//             })
//             .then(function (data) {
//                 console.log(data.toString());
//             })
//             .catch(function (err) {
//                 console.log(err);
//             });
//         //fs-readfile-promise模块，它的作用就是返回一个 Promise 版本的readFile函数
//         //Promise 提供then方法加载回调函数，catch方法捕捉执行过程中抛出的错误
// (3) Generator 函数
//         function *asyncJob() {
//             // ...其他代码
//             var f = yield readFile(fileA);
//             // ...其他代码
//         }
//        //上面代码的函数asyncJob是一个协程，它的奥妙就在其中的yield命令。它表示执行到此处，执行权将交给其他协程。
//        //也就是说，yield命令是异步两个阶段的分界线
// (3.1) 协程的 Generator 函数实现: Generator函数可以交出函数的执行权
//         function* gen(x) {
//             var y = yield x + 2;
//             return y;
//         }
//         var g = gen(1);
//         g.next() // { value: 3, done: false }
//         g.next() // { value: undefined, done: true }
//         调用 Generator 函数，会返回一个内部指针（即遍历器）g。Generator 函数执行它不会返回结果，返回的是指针对象。
//         调用指针g的next方法，会移动内部指针（即执行异步任务的第一段），指向第一个遇到的yield语句，上例是执行到x + 2为止
// (3.2) Generator 函数的数据交换和错误处理
// next返回值的value属性，是 Generator 函数向外输出数据；next方法还可以接受参数，向 Generator 函数体内输入数据
//     function* gen(x){
//         var y = yield x + 2;
//         return y;
//     }
//     var g = gen(1);
//     g.next() // { value: 3, done: false }
//     g.next(2) // { value: 2, done: true }
//   第一next方法的value属性，返回表达式x + 2的值3。第二个next方法带有参数2，这个参数可以传入 Generator 函数，
//   作为上个阶段异步任务的返回结果，被函数体内的变量y接收。因此，这一步的value属性，返回的就是2（变量y的值）
//
// (3.3) 异步任务的封装
//         var fetch = require('node-fetch');
//         function* gen(){
//             var url = 'https://api.github.com/users/github';
//             var result = yield fetch(url);
//             console.log(result.bio);
//         }
//         // 执行这段代码的方法如下
//         var g = gen();
//         var result = g.next();
//         result.value.then(function(data){
//             return data.json();
//         }).then(function(data){
//             g.next(data);
//         });
//         首先执行 Generator 函数，获取遍历器对象，然后使用next方法（第二行），执行异步任务的第一阶段。
//         由于Fetch模块返回的是一个 Promise 对象，因此要用then方法调用下一个next方法
//
// 4. Thunk 函数 : Thunk 函数是自动执行 Generator 函数的一种方法。
// Thunk 函数的含义: 编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。
//                 这个临时函数就叫做 Thunk 函数
//         function f(m) {return m * 2;};f(x + 5);//等同于
//         var thunk = function () {return x + 5;};function f(thunk) {return thunk() * 2;}
//      // 函数f的参数x + 5被一个函数替换了。凡是用到原参数的地方，对Thunk函数求值即可
// 任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式
//     // ES5版本
//     var Thunk = function(fn){
//         return function (){
//             var args = Array.prototype.slice.call(arguments);
//             return function (callback){
//                 args.push(callback);
//                 return fn.apply(this, args);
//             }
//         };
//     };
//     // ES6版本
//     const Thunk = function(fn) {
//         return function (...args) {
//             return function (callback) {
//                 return fn.call(this, ...args, callback);
//             }
//         };
//     };
//     var readFileThunk = Thunk(fs.readFile);
//     readFileThunk(fileA)(callback);
//
// Thunkify 模块
// 生产环境的转换器，建议使用 Thunkify 模块
// 安装: $ npm install thunkify
// 使用:
//     var thunkify = require('thunkify');
//     var fs = require('fs');
//     var read = thunkify(fs.readFile);
//     read('package.json')(function(err, str){
//         // ...
//     });
//     // Thunkify 的源码与上一节那个简单的转换器非常像。
//     function thunkify(fn) {
//         return function() {
//             var args = new Array(arguments.length);
//             var ctx = this;
//
//             for (var i = 0; i < args.length; ++i) {
//                 args[i] = arguments[i];
//             }
//
//             return function (done) {
//                 var called;
//
//                 args.push(function () {
//                     if (called) return;
//                     called = true;
//                     done.apply(null, arguments);
//                 });
//
//                 try {
//                     fn.apply(ctx, args);
//                 } catch (err) {
//                     done(err);
//                 }
//             }
//         }
//     };
//     // 它的源码主要多了一个检查机制，变量called确保回调函数只运行一次
//     function f(a, b, callback){
//         var sum = a + b;
//         callback(sum);
//         callback(sum);
//     }
//
//     var ft = thunkify(f);
//     var print = console.log.bind(console);
//     ft(1, 2)(print);
//     // 3
//     // 上面代码中，由于thunkify只允许回调函数执行一次，所以只输出一行结果
//
// Generator函数的流程管理
// Generator 函数封装了两个异步操作。
//     var fs = require('fs');
//     var thunkify = require('thunkify');
//     var readFileThunk = thunkify(fs.readFile);
//     var gen = function* (){
//         var r1 = yield readFileThunk('/etc/fstab');
//         console.log(r1.toString());
//         var r2 = yield readFileThunk('/etc/shells');
//         console.log(r2.toString());
//     };
//  yield命令用于将程序的执行权移出 Generator 函数，那么就需要一种方法，将执行权再交还给 Generator 函数
//  这种方法就是 Thunk 函数，因为它可以在回调函数里，将执行权交还给 Generator 函数
//     var g = gen();
//     var r1 = g.next();
//     r1.value(function (err, data) {
//         if (err) throw err;
//         var r2 = g.next(data);
//         r2.value(function (err, data) {
//             if (err) throw err;
//             g.next(data);
//         });
//     });
//     变量g是 Generator 函数的内部指针，表示目前执行到哪一步。
//     next方法负责将指针移动到下一步，并返回该步的信息（value属性和done属性）
//     Generator 函数的执行过程，其实是将同一个回调函数，反复传入next方法的value属性
//
// Thunk 函数的自动流程管理 : 自动执行 Generator 函数
// Thunk 函数的 Generator 执行器:
//     function run(fn) {
//         var gen = fn();
//
//         function next(err, data) {
//             var result = gen.next(data);
//             if (result.done) return;
//             result.value(next);
//         }
//
//         next();
//     }
//     function* g() {
//         // ...
//     }
//     run(g);
//     run函数，就是一个 Generator 函数的自动执行器。内部的next函数就是 Thunk 的回调函数。next函数先将指针移到
//     Generator 函数的下一步（gen.next方法），然后判断 Generator 函数是否结束（result.done属性），
//     如果没结束，就将next函数再传入 Thunk 函数（result.value属性），否则就直接退出
//     执行 Generator 函数方便多了。不管内部有多少个异步操作，直接把 Generator 函数传入run函数即可
//     var g = function* (){
//         var f1 = yield readFile('fileA');
//         var f2 = yield readFile('fileB');
//         // ...
//         var fn = yield readFile('fileN');
//     };
//     run(g);
//     函数g封装了n个异步的读取文件操作，只要执行run函数，这些操作就会自动完成





































































