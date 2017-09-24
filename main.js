// 1
    // var mod = require('./lib');
    // // console.log(mod.counter);  // 3
    // // mod.incCounter();
    // // console.log(mod.counter);//3
    // // lib.js模块加载以后，它的内部变化就影响不到输出的mod.counter,因为mod.counter是一个原始类型的值，会被缓存
    // // 写成函数
    // console.log(mod.counter);  //3
    // mod.incCounter();
    // console.log(mod.counter);//4
// 2
    import { counter, incCounter } from './lib';
    console.log(counter); // 3
    incCounter();
    console.log(counter); // 4

//==================================使用 babel-node 代替 node 开启js文件,不会报import的错误=======================//

// 3
// const es_namespace = require('./lib');
// console.log(es_namespace.default); //{bar:'my-default'}




























