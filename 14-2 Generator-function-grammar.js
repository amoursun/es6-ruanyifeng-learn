// 5. Generator.prototype.throw()
// Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获
//         var g = function* (){
//             try {
//                 yield;
//             } catch (e) {
//                 console.log('内部捕获', e)
//             };
//         };
//         var i = g();
//         i.next();
//         try {
//             i.throw('a');
//             i.throw('b');
//         } catch (e) {
//             console.log('外部捕获', e);
//         }
//         // 内部捕获 a
//         // 外部捕获 b
//     遍历器对象i连续抛出两个错误。第一个错误被 Generator 函数体内的catch语句捕获。
//     i第二次抛出错误，由于 Generator 函数内部的catch语句已经执行过了，不会再捕捉到这个错误了，
//     所以这个错误就被抛出了 Generator 函数体，被函数体外的catch语句捕获

// 6. Generator.prototype.return()
// Generator函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历Generator函数
//         function* gen() {
//             yield 1;
//             yield 2;
//             yield 3;
//         }
//         var g = gen();
//         console.log(g.next());// { value: 1, done: false }
//         console.log(g.next());// { value: 2, done: false }
//         console.log(g.return());//{ value: undefined, done: true }  return方法调用时，不提供参数，则返回值的value属性为undefined
//         console.log(g.return('foo'));// { value: "foo", done: true } Generator函数的遍历就终止了,done 为 true
//         console.log(g.next());// { value: undefined, done: true }
// 如果 Generator 函数内部有try...finally代码块，那么return方法会推迟到finally代码块执行完再执行
//     function* numbers () {
//         yield 1;
//         try {
//             yield 2;
//             yield 3;
//         } finally {
//             yield 4;
//             yield 5;
//         }
//         yield 6;
//     }
//     var g = numbers();
//     console.log(g.next()) // { value: 1, done: false }
//     console.log(g.next()) // { value: 2, done: false }
//     console.log(g.return(7)) // { value: 4, done: false }
//     //本来执行yield 3 ,但由于return 改变了值,输出的是finally中的,
//      finally中执行完,在执行修改的return值,并且Gennerator函数遍历终止了,不再向后执行
//     console.log(g.next()) // { value: 5, done: false }
//     console.log(g.next()) // { value: 7, done: true }
// function* numbers () {
//     yield 1;
//     try {
//         yield 2;
//         yield 3;
//         yield 4;
//     } finally {
//         yield 5;
//         yield 6;
//     }
//     yield 7;
// }
// var g = numbers();
// console.log(g.next()) // { value: 1, done: false }
// console.log(g.next()) // { value: 2, done: false }
// console.log(g.return(8)) // { value: 5, done: false }
// console.log(g.next()) // { value: 6, done: false }
// console.log(g.next()) // { value: 8, done: true }
// console.log(g.next())//打印这个没有用,在此处相当于没用的代码
// 调用return方法后，就开始执行finally代码块，然后等到finally代码块执行完，再执行return方法


// 7. yield* 表达式
// 在Generator函数内部调用另一个Generator函数,默认是没有效果的
//         function* a(){
//             yield 'a';
//             yield 'b';
//         }
//         function* b(){
//             yield 'c';
//             a();
//             yield 'd';
//         }
//         for (let v of b()) {
//             console.log(v);
//         }
//         //c
//         //d  调用无效果
// 改变: 需要用到yield*表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数
//         function* a(){
//             yield 'a';
//             yield 'b';
//         }
//         function* b(){
//             yield 'c';
//             yield* a();// 此处必须是 yield* a();==> 会返回内部值
//             yield 'd';
//         }
//      等同于:
//         function* b(){
//             yield 'c';
//             for (let v of a()) {
//                 console.log(v);
//             }
//             yield 'd';
//         }
//         for (let v of b()) {
//             console.log(v);
//         }
//         //c
//         //a
//         //b
//         //d
//         function* a(){
//             yield 'a';
//             yield 'b';
//         }
//         function* b(){
//             yield 'c';
//             yield a(); //返回yield a() ==>遍历器对象
//             yield 'd';
//         }
//         for (let v of b()) {
//             console.log(v);
//         }
//         //c
//         //{} 遍历器对象
//         //d
// yield*后面的 Generator 函数（没有return语句时），等同于在 Generator 函数内部，部署一个for...of循环
// 如果yield*后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员 : yield* ["a", "b", "c"]
// 实际上，任何数据结构只要有 Iterator 接口，就可以被yield*遍历: 字符串也可以被遍历 yield* 'abc'
// 如果被代理的 Generator 函数有return语句，那么就可以向代理它的 Generator 函数返回数据
//         function *foo() {
//             yield 2;
//             yield 3;
//             return "foo";
//         }
//         function *bar() {
//             yield 1;
//             var v = yield *foo();
//             console.log( "v: " + v );
//             yield 4;
//         }
//         var it = bar();
//         console.log(it.next())// {value: 1, done: false}
//         console.log(it.next())// {value: 2, done: false}
//         console.log(it.next())// {value: 3, done: false}
//         // it.next();// "v: foo"
//         console.log(it.next());// "v: foo"  {value: 4, done: false} 这是因为函数foo的return语句，向函数bar提供了返回值
//         console.log(it.next())// {value: undefined, done: true}
//     function* genFuncWithReturn() {
//         yield 'a';
//         yield 'b';
//         return 'The result';
//     }
//     function* logReturned(genObj) {
//         let result = yield* genObj;
//         console.log(result);
//     }
//     console.log([...logReturned(genFuncWithReturn())])
//     控制台输出:The result , 但值为: [ 'a', 'b' ] genFuncWithReturn的return语句的返回值The result，会返回给函数logReturned内部的result变量
// yield*命令可以很方便地取出嵌套数组的所有成员
//         function* iterTree(tree) {
//             if (Array.isArray(tree)) {
//                 for(let i=0; i < tree.length; i++) {
//                     yield* iterTree(tree[i]);//递归
//                 }
//             } else {
//                 yield tree;
//             }
//         }
//         const tree = [ 1, [2,[4, 5,[6, 7]], 3], [8, 9, [10, [11, 12, [13, [14, 15]]]]] ];
//         for(let x of iterTree(tree)) {
//             console.log(x);
//         }
//         // 1 2 4 5 6 7 3 8 9 10 11 12 13 14 15
// yield*语句遍历完全二叉树
//             // 下面是二叉树的构造函数，
//             // 三个参数分别是左树、当前节点和右树
//             function Tree(left, label, right) {
//                 this.left = left;
//                 this.label = label;
//                 this.right = right;
//             }
//             // 下面是中序（inorder）遍历函数。
//             // 由于返回的是一个遍历器，所以要用generator函数。
//             // 函数体内采用递归算法，所以左树和右树要用yield*遍历
//             function* inorder(t) {
//                 if (t) {
//                     yield* inorder(t.left);
//                     yield t.label;
//                     yield* inorder(t.right);
//                 }
//             }
//             // 下面生成二叉树
//             function make(array) {
//                 // 判断是否为叶节点
//                 if (array.length == 1) return new Tree(null, array[0], null);
//                 return new Tree(make(array[0]), array[1], make(array[2]));
//             }
//             let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);
//             // 遍历二叉树
//             var result = [];
//             for (let node of inorder(tree)) {
//                 result.push(node);
//             }
//             console.log(result);
//             // ['a', 'b', 'c', 'd', 'e', 'f', 'g']


// 8. 作为对象属性的Generator函数 : let obj = { * myGeneratorMethod() {}}; === let obj = {myGeneratorMethod: function* () {}};
// 9. Generator 函数的this
// ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的prototype对象上的方法
//         function* g() {};
//         g.prototype.hello = function (){
//             return 'hi!';
//         }
//         let obj = g();
//         console.log(obj instanceof g);//true
//         console.log(obj.hello());//hi!
//     function* g() {
//         this.a = 11;
//     }
//     let obj = g();
//     console.log(obj.a)// undefined
//     如果把g当作普通的构造函数，并不会生效，因为g返回的总是遍历器对象，而不是this对象
// Generator函数也不能跟new命令一起用，会报错 : function* F(){}; new F();//报错

//Generator 函数既可以用next方法,又可以获得正常的this  的方法如下:
// (1) 先生成空{},使用call方法绑定 Generator 函数内部的this,调用构造函数,{}就是Generator函数实例对象了;
//         function* F() {
//             this.a = 1;
//             yield this.b = 2;
//             yield this.c = 3;
//         }
//         var obj = {};
//         var f = F.call(obj);
//         console.log(f.next());  // Object {value: 2, done: false}
//         console.log(f.next());  // Object {value: 3, done: false}
//         console.log(f.next());  // Object {value: undefined, done: true}
//         console.log(obj.a); // 1
//         console.log(obj.b); // 2
//         console.log(obj.c); // 3
//     将obj换成F.prototype
//         function* F() {
//             this.a = 1;
//             yield this.b = 2;
//             yield this.c = 3;
//         }
//         var f = F.call(F.prototype);
//         console.log(f.next());  // Object {value: 2, done: false}
//         console.log(f.next());  // Object {value: 3, done: false}
//         console.log(f.next());  // Object {value: undefined, done: true}
//         console.log(f.a); // 1
//         console.log(f.b); // 2
//         console.log(f.c); // 3
//     再将F改成构造函数，就可以对它执行new命令了
//         function* gen() {
//             this.a = 1;
//             yield this.b = 2;
//             yield this.c = 3;
//         }
//         function F() {
//              return gen.call(gen.prototype);
//         }
//         var f = new F();
//         console.log(f.next());  // Object {value: 2, done: false}
//         console.log(f.next());  // Object {value: 3, done: false}
//         console.log(f.next());  // Object {value: undefined, done: true}
//         console.log(f.a); // 1
//         console.log(f.b); // 2
//         console.log(f.c); // 3

// 10. 应用
// （1）异步操作的同步化表达 : Generator 函数的一个重要实际意义就是用来处理异步操作，改写回调函数
//                         异步操作的后续操作可以放在yield表达式下面，反正要等到调用next方法时再执行

        // function* loadUI() {
        //     showLoadingScreen();
        //     yield loadUIDataAsynchronously();
        //     hideLoadingScreen();
        // }
        // var loader = loadUI();
        // // 加载UI
        // loader.next()
        // // 卸载UI
        // loader.next()
        // 第一次调用loadUI函数时，该函数不会执行，仅返回一个遍历器
        // 下一次对该遍历器调用next方法，则会显示Loading界面（showLoadingScreen），并且异步加载数据（loadUIDataAsynchronously）
        // 数据加载完成，再使用next方法，则会隐藏Loading界面（hideLoadingScreen）,所有逻辑写在一个函数里
//  Ajax 是典型的异步操作，通过 Generator 函数部署 Ajax 操作，可以用同步的方式表达
//         function* main() {
//             var result = yield request("http://some.url");
//             var resp = JSON.parse(result);
//             console.log(resp.value);
//         }
//         function request(url) {
//             makeAjaxCall(url, function(response){
//                 it.next(response);
//             });
//         }
//         var it = main();
//         console.log(it.next());//有问题
//  (2) 管理控制流
// （3）部署 Iterator 接口
// 利用 Generator 函数，可以在任意对象上部署 Iterator 接口。
//         function* iterEntries(obj) {
//             let keys = Object.keys(obj);
//             for (let i=0; i < keys.length; i++) {
//                 let key = keys[i];
//                 yield [key, obj[key]];
//             }
//         }
//         let myObj = { foo: 3, bar: 7 };
//         for (let [key, value] of iterEntries(myObj)) {
//             console.log(key, value);
//         }
//
//         // foo 3
//         // bar 7
// 上述代码中，myObj是一个普通对象，通过iterEntries函数，就有了 Iterator 接口。也就是说，可以在任意对象上部署next方法。
// （4）作为数据结构
// Generator 可以看作是数据结构，一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。
//     function *doStuff() {
//         yield fs.readFile.bind(null, 'hello.txt');
//         yield fs.readFile.bind(null, 'world.txt');
//         yield fs.readFile.bind(null, 'and-such.txt');
//     }
//     for (task of doStuff()) {}
//
//     // es5
//     function doStuff() {
//         return [
//             fs.readFile.bind(null, 'hello.txt'),
//             fs.readFile.bind(null, 'world.txt'),
//             fs.readFile.bind(null, 'and-such.txt')
//         ];
//     }
//     // 上面的函数，可以用一模一样的for...of循环处理！两相一比较，就不难看出 Generator 使得数据或者操作，具备了类似数组的接口


















































