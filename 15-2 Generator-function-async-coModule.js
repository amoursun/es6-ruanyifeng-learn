// 5. co 模块  : 用于Generator 函数的自动执行
// 下面Generator 函数，用于依次读取两个文件
//     var gen = function* () {
//         var f1 = yield readFile('/etc/fstab');
//         var f2 = yield readFile('/etc/shells');
//         console.log(f1.toString());
//         console.log(f2.toString());
//     };
//     var co = require('co');//co 模块可以让你不用编写 Generator 函数的执行器
//     co(gen);//Generator 函数只要传入co函数，就会自动执行
//     co(gen).then(function (){//co函数返回一个Promise对象，因此可以用then方法添加回调函数
//         console.log('Generator 函数执行完成');
//     });
//     // 上面代码中，等到 Generator 函数执行结束，就会输出一行提示
//
// (5.1) co 模块的原理
// Generator 就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权
// 1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
// （2）Promise 对象。将异步操作包装成 Promise 对象，用then方法交回执行权。
// co 模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。使用 co 的前提条件是，
// Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。如果数组或对象的成员，
// 全部都是 Promise 对象，也可以使用 co


































































