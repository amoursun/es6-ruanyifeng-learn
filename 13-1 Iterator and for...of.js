// 1. Iterator（遍历器）的概念
// 遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。
// 任何数据结构只要部署Iterator接口，就可以完成遍历操作
//     Iterator 的作用有三个：
//         一是为各种数据结构，提供一个统一的、简便的访问接口；
//         二是使得数据结构的成员能够按某种次序排列；
//         三是ES6创造了一种新的遍历命令for...of循环，Iterator接口主要供for...of消费
// 无限遍历循环例子:
//     var it = itMake();
//     console.log(it.next().value);//0
//     console.log(it.next().value);//1
//     console.log(it.next().value);//2
//     console.log(it.next().value);//3
//
//     function itMake() {
//         var index = 0;
//         return {
//             next: function(){
//                 return {value: index++, done: false};
//             }
//         };
//     }


// 2.Iterator 接口 : 默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，或者说，
//                  一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”(iterable)
//         Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。
//         至于属性名Symbol.iterator，它是一个表达式，返回Symbol对象的iterator属性，
//         是预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内
// 原生具备Iterator接口的数据结构如下:
//     Array
//     Map
//     Set
//     String
//     TypedArray
//     函数的 arguments 对象
// 对象如果要具备可被for...of循环调用的 Iterator 接口，就必须在Symbol.iterator的属性上部署遍历器生成方法
// （原型链上的对象具有该方法也可）


// 3. 调用 Iterator 接口的场合
// (1) 结构赋值 : 默认调用Symbol.iterator方法
//         let set = new Set().add('a').add('b').add('c');
//         let [x,y] = set;
//         // x='a'; y='b'
//         let [first, ...rest] = set;
//         // first='a'; rest=['b','c'];
// (2) 扩展运算符（...）: 也会调用默认的 Iterator 接口
//         let arr = ['b', 'c'];
//         ['a', ...arr, 'd']
//         // ['a', 'b', 'c', 'd']
// (3) yield* : 后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口
//         let generator = function* () {
//             yield 1;
//             yield* [2,3,4];
//             yield 5;
//         };
//         var iterator = generator();
//         iterator.next() // { value: 1, done: false }
//         iterator.next() // { value: 2, done: false }
//         iterator.next() // { value: 3, done: false }
//         iterator.next() // { value: 4, done: false }
//         iterator.next() // { value: 5, done: false }
//         iterator.next() // { value: undefined, done: true }
// （4）其他场合 : 由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口
//         for...of
//         Array.from()
//         Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
//         Promise.all()
//         Promise.race()


// 4. 字符串是一个类似数组的对象，也原生具有 Iterator 接口


// 5. Iterator接口与Generator函数
//         var myIterable = {};
//         myIterable[Symbol.iterator] = function* () {
//             yield 1;
//             yield 2;
//             yield 3;
//         };
//         [...myIterable] // [1, 2, 3]
//
//         // 或者采用下面的简洁写法
//         let obj = {
//             * [Symbol.iterator]() {
//             yield 'hello';
//             yield 'world';
//         }
//         };
//
//         for (let x of obj) {
//             console.log(x);
//         }
//         // hello
//         // world


// 6. 遍历器对象的 return()，throw()
// 遍历器对象除了具有next方法，还可以具有return方法和throw方法
// 自己写遍历器对象生成函数, next方法是必须部署的，return方法和throw方法是否部署是可选的
// return方法的使用场合:
//     如果for...of循环提前退出（通常是因为出错，或者有break语句或continue语句），
//     就会调用return方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return方法。
//         function readLinesSync(file) {
//             return {
//                 next() {
//                     if (file.isAtEndOfFile()) {
//                         file.close();
//                         return { done: true };
//                     }
//                 },
//                 return() {
//                     file.close();
//                     return { done: true };
//                 },
//             };
//         }
//         for (let line of readLinesSync(fileName)) { //文件的遍历提前返回,会触发return方法
//             console.log(line);
//             break;
//         }
// 函数readLinesSync接受一个文件对象作为参数，返回一个遍历器对象，
// 其中除了next方法，还部署了return方法,return方法必须返回一个对象，这是Generator规格决定的
// throw 方法主要是配合Generator函数使用，一般的遍历器对象用不到这个方法


// 7. for ... of 循环
// 一个数据结构只要部署了Symbol.iterator属性，就被视为具有iterator接口，就可以用for...of循环遍历它的成员
// for ... of 循环内部调用了Symbol.iterator方法
// for...of循环可以使用的范围包括:
//         数组、
//         Set 和 Map 结构、
//         某些类似数组的对象（比如arguments对象、DOM NodeList 对象）、
//         后文的 Generator 对象，
//         字符串
//     entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值；
//              对于 Set，键名与键值相同。Map 结构的 Iterator 接口，默认就是调用entries方法。
//     keys() 返回一个遍历器对象，用来遍历所有的键名。
//     values() 返回一个遍历器对象，用来遍历所有的键值。
//     这三个方法调用后生成的遍历器对象，所遍历的都是计算生成的数据结构。
            // let arr = ['a', 'b', 'c'];
            // for (let pair of arr.entries()) {
            //     console.log(pair);
            // }
            // // [0, 'a']
            // // [1, 'b']
            // // [2, 'c']
























































































































































