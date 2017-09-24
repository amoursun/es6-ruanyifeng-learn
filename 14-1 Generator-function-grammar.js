// 1. Generator函数
// 形式上，Generator 函数是一个普通函数，但是有两个特征。
//     一是,function 关键字与函数名之间有一个星号;
//     二是，函数体内部使用yield表达式，定义不同的内部状态
// 总结一下，调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。
//         以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。
//         value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束

// 2. yield 表达式 : yield表达式就是暂停标志
// 只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数,yield表达式就是暂停标志
// 遍历器对象的next方法的运行逻辑:
//     遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值
//     下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式
//     如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，
//              并将return语句后面的表达式的值，作为返回的对象的value属性值
//     如果该函数没有return语句，则返回的对象的value属性值为undefined
//     注意: yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行
//          function* gen() {yield  123 + 456;}
//          yield后面的表达式123 + 456，不会立即求值，只会在next方法将指针移到这一句时，才会求值
// yield表达式与return语句:
//     相同: 都能返回紧跟在语句后面的那个表达式的值
//     不同: 每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行，而return语句不具备位置记忆的功能
//          一个函数里面，只能执行一次（或者说一个）return语句,但可以执行多次yield表达式
//         function* f() {
//             console.log('执行了！')
//         }
//         var generator = f();
//         setTimeout(function () {
//             generator.next()
//         }, 2000);
//         //2秒后显示执行了
//      函数f如果是普通函数，在为变量generator赋值时就会执行。但函数f是一个 Generator 函数，
//      就变成只有调用next方法时，函数f才会执行
// yield表达式只能用在 Generator 函数里面，用在其他地方都会报错
// yield表达式如果用在另一个表达式之中，必须放在圆括号里面
//         function* demo() {
//             console.log('Hello' + yield); // SyntaxError
//             console.log('Hello' + yield 123); // SyntaxError
//
//             console.log('Hello' + (yield)); // OK
//             console.log('Hello' + (yield 123)); // OK
//         }
// yield表达式用作函数参数或放在赋值表达式的右边，可以不加括号
//         function* demo() {
//             foo(yield 'a', yield 'b'); // OK
//             let input = yield; // OK
//         }
// forEach方法的参数是一个普通函数，但是在里面使用了yield表达式,也会产生语法错误,改用for循环正常
//         var arr = [1, [[2, 3], 4], [5, 6]];
//         var flat = function* (a) {
//             var length = a.length;
//             for (var i = 0; i < length; i++) {
//                 var item = a[i];
//                 if (typeof item !== 'number') {
//                     yield* flat(item);
//                 } else {
//                     yield item;
//                 }
//             }
//         };
//         for (var f of flat(arr)) {
//             console.log(f);
//         }
//         // 1, 2, 3, 4, 5, 6


// 3. Generater函数 与 Iterator 接口的关系
// 任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象
// 可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口
//         var myIterable = {};
//         myIterable[Symbol.iterator] = function* () {
//             yield 1;
//             yield 2;
//             yield 3;
//         };
//         console.log([...myIterable]) // [1, 2, 3]
//         function* gen(){};
//         var g = gen();
//         console.log(g[Symbol.iterator]() === g);//true



// 4. next方法的参数
// yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值
//     function* foo(x) {
//         var y = 2 * (yield (x + 1));
//         var z = yield (y / 3);
//         return (x + y + z);
//     }
//     var a = foo(5);
//     console.log(a.next()) // Object{value:6, done:false}
//     console.log(a.next()) // Object{value:NaN, done:false}
//     console.log(a.next()) // Object{value:NaN, done:true}
//     // 第二次运行next方法的时候不带参数，导致y的值等于2 * undefined（即NaN），除以3以后还是NaN，因此返回对象的value属性也等于NaN。
//     // 第三次运行Next方法的时候不带参数，所以z等于undefined，返回对象的value属性等于5 + NaN + undefined，即NaN。
//     var b = foo(5);
//     console.log(b.next()) // { value:6, done:false }
//     console.log(b.next(12)) // { value:8, done:false }
//     console.log(b.next(13)) // { value:42, done:true }
//     // 如果向next方法提供参数，代码第一次调用b的next方法时，返回x+1的值6；
//     // 第二次调用next方法，将上一次yield表达式的值设为12，因此y等于24，返回y / 3的值8；
//     // 第三次调用next方法，将上一次yield表达式的值设为13，因此z等于13，这时x等于5，y等于24，所以return语句的值等于42。
//     // 注意，由于next方法的参数表示上一个yield表达式的返回值，所以第一次使用next方法时，不能带有参数。
//     function* dataConsumer() {
//         console.log('Started');
//         console.log(`1. ${yield}`);
//         console.log(`2. ${yield}`);
//         return 'result';
//     }
//     let genObj = dataConsumer();
//     genObj.next();// Started
//     genObj.next('a')// 1. a
//     genObj.next('b')// 2. b
//     console.log(genObj.next());// Started { value: undefined, done: false }
//     console.log(genObj.next('a'))// 1. a  { value: undefined, done: false }
//     console.log(genObj.next('b'))// 2. b  { value: undefined, done: false }

// 5. for ... of 循环
    // function *foo() {
    //     yield 1;
    //     yield 2;
    //     yield 3;
    //     yield 4;
    //     yield 5;
    //     return 6;
    // }
    //
    // for (let v of foo()) {
    //     console.log(v);
    // }
    // // 1 2 3 4 5
    // next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象，
    // 所以上面代码的return语句返回的6，不包括在for...of循环之中

    //     function* fibonacci() {
    //         let [prev, curr] = [0, 1];
    //         for (;;) {
    //             [prev, curr] = [curr, prev + curr];
    //             yield curr;
    //         }
    //     }
    //     for (let n of fibonacci()) {
    //         if (n > 1000) break;
    //         console.log(n);
    //     }
    //     // 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987

    // function* objectEntries(obj) {
    //     let propKeys = Reflect.ownKeys(obj);
    //
    //     for (let propKey of propKeys) {
    //         yield [propKey, obj[propKey]];
    //     }
    // }
    // let jane = { first: 'Jane', last: 'Doe' };
    // for (let [key, value] of objectEntries(jane)) {
    //     console.log(`${key}: ${value}`);
    // }
    // // first: Jane
    // // last: Doe
    //
    // function* objectEntries() {
    //     let propKeys = Object.keys(this);
    //
    //     for (let propKey of propKeys) {
    //         yield [propKey, this[propKey]];
    //     }
    // }
    // let jane = { first: 'Jane', last: 'Doe' };
    // jane[Symbol.iterator] = objectEntries;
    // for (let [key, value] of jane) {
    //     console.log(`${key}: ${value}`);
    // }
    // // first: Jane
    // // last: Doe

//  除了for...of循环以外，扩展运算符（...）、解构赋值和Array.from方法内部调用的，都是遍历器接口
    // function* numbers () {
    //     yield 1
    //     yield 2
    //     return 3
    //     yield 4
    // }
    // // 扩展运算符
    // [...numbers()] // [1, 2]
    // // Array.from 方法
    // Array.from(numbers()) // [1, 2]
    // // 解构赋值
    // let [x, y] = numbers();
    // x // 1
    // y // 2
    // // for...of 循环
    // for (let n of numbers()) {
    //     console.log(n)
    // }
    // // 1
    // // 2


































































































