// ES6 class 的基本语法
// 1. 介绍
// ES5 的构造函数写法:
//     function Prose(x, y) {
//         this.x = x;
//         this.y = y;
//     }
//     Prose.prototype.toString = function () {
//         return '(' + this.x + ',' + this.y + ')';
//     };
//     var p = new Prose(1, 2);
//     console.log(p);//{ x: 1, y: 2 }
//     console.log(p.toString());//(1,2)
// ES6 的class写法:(定义类)
    class Prose {
        constructor (x, y) {
            this.x = x;
            this.y = y;
        }
        toString(){
            return '(' + this.x + ', ' + this.y + ')';
        }
    }
    console.log(typeof Prose);//function
    console.log(Prose === Prose.prototype.constructor);//true
// 类的数据类型就是函数，类本身就指向构造函数
// constructor方法，这就是构造方法，而this关键字则代表实例对象
// ES5 的构造函数Prose，对应 ES6 的Prose类的构造方法
// 也可以直接对类使用new命令，跟构造函数的用法完全一致
    class Bar {
        doing() {
            console.log('doing');
        }
    }
    var d = new Bar();
    d.doing();//doing
    console.log(d.constructor === Bar.prototype.constructor);//true
// 构造函数的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面
// 在类的实例上面调用方法，其实就是调用原型上的方法
//         class Point {
//             constructor() {
//                 // ...
//             }
//             toString() {
//                 // ...
//             }
//             toValue() {
//                 // ...
//             }
//         }
//         // 等同于
//         Point.prototype = {
//             constructor() {},
//             toString() {},
//             toValue() {},
//         };
// 类的新方法可以添加在prototype对象上面: Object.assign方法 可以很方便地一次向类添加多个方法
        class Point {
            constructor(){
                console.log('constructor');
            }
        }
        Object.assign(Point.prototype, {
            toString(){console.log('toString');},
            toValue(){console.log('toValue');}
        });
        var p = new Point();//constructor
        p.toString();//toString
        p.toValue();//toValue
        console.log(Object.keys(Point.prototype));//[ 'toString', 'toValue' ]
// prototype对象的constructor属性，直接指向“类”的本身
// 类的内部所有定义的方法，都是不可枚举的,但Object.assign方法添加的方法是可枚举的
// ES5 中如此写是可以枚举的: Point.prototype.toString = function() {};//['toString']
        class Pardon {
            constructor(x, y) {}
            toString() {}
        }
        console.log(Object.keys(Pardon.prototype));// []
        console.log(Object.getOwnPropertyNames(Pardon.prototype));// ["constructor","toString"]
// 类的属性名，可以采用表达式
        let methodName = 'getArea';
        class Square {
            constructor(length) {
                // ...
            }
            [methodName]() {
                // ...
            }
        }
        console.log(Object.keys(Square.prototype));// []
        console.log(Object.getOwnPropertyNames(Square.prototype));// ["constructor","getArea"]
// 2. 严格模式
// 类和模块的内部，默认就是严格模式

// 3. constructor 方法
// constructor方法是类的默认方法,必须存在的，通过new命令生成对象实例时，自动调用该方法,若没有写出来,则空的constructor方法被添加
// constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象
        class Foo {
            constructor() {
                return Object.create(null);
            }
        }
        console.log(new Foo() instanceof Foo);//false
        // constructor默认返回的对象this指向了新的Object.create(null)对象,实例对象不是Foo类的实例;
// 注意: 类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行
//         class NewObj {
//             doing() {
//                 console.log('doing');
//             }
//         }
//         NewObj().doing();//报错
//        //TypeError: Class constructor NewObj cannot be invoked without 'new'

// 4. class 的实例对象 : 生成类的实例对象的写法，与 ES5 完全一样，也是使用new命令, 不用new,会报错
// 实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）
        class Result {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            toString() {
                return '(' + this.x + ', ' + this.y + ')';
            }
        }
        var result = new Result(2, 3);
        console.log(result.toString()) // (2, 3)
        console.log(result.hasOwnProperty('x')) // true
        console.log(result.hasOwnProperty('y')) // true
        console.log(result.hasOwnProperty('toString')) // false
        console.log(result.__proto__.hasOwnProperty('toString')) // true
        //x和y都是实例对象point自身的属性(this上),hasOwnProperty方法返回true
        //toString是原型对象的属性,hasOwnProperty方法返回false

// 与 ES5 一样，类的所有实例共享一个原型对象, 可以通过实例的__proto__属性为“类”添加方法
// 不建议在生产中使用该属性，避免对环境产生依赖。生产环境中，我们可以使用 Object.getPrototypeOf 方法来获取实例对象的原型，
// 然后再来为原型添加方法/属性
// 使用实例的__proto__属性改写原型，不推荐使用，因为这会改变“类”的原始定义，影响到所有实例,后面创建的实例均能调用这个方法
        var p1 = new Result(2,3);
        var p2 = new Result(3,2);
        p1.__proto__.printName = function () { return 'Oops' };
        p1.printName() // "Oops"
        p2.printName() // "Oops"
        var p3 = new Result(4,2);
        p3.printName() // "Oops"

// 5. class 表达式 : 与函数一样，类也可以使用表达式的形式定义
        const MyClass = class Me { //Me如果内部没有用到可以省略
            getClassName() {
                return Me.name;
            }
        };
    // 这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类
        let inst = new MyClass();
        console.log(inst.getClassName()) // Me
        // console.log(Me.name) // ReferenceError: Me is not defined

        let person = new class {//改写成自执行class,并且省略了当前类Me
            constructor(name) {
                this.name = name;
            }

            sayName() {
                console.log(this.name);
            }
        }('张三');
        person.sayName(); // "张三"

// 6. 不存在变量提升: 无定义会报错
// 7. 私有方法: es6没有提供
// 7.1 方法前面的下划线，表示这是一个只限于内部使用的私有方法。但是，这种命名是不保险的，在类的外部，还是可以调用到这个方法。
// 7.2 索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的
//         class Widget {
//             foo (baz) {
//                 bar.call(this, baz);
//             }
//         }
//         function bar(baz) {
//             return this.snaf = baz;
//         }
        // foo是公有方法，内部调用了bar.call(this, baz)。这使得bar实际上成为了当前模块的私有方法
// 7.3 还有一种方法是利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值
//         const bar = Symbol('bar');
//         const snaf = Symbol('snaf');
//         export default class myClass{
//             // 公有方法
//             foo(baz) {
//                 this[bar](baz);
//             }
//             // 私有方法
//             [bar](baz) {
//                 return this[snaf] = baz;
//             }
//             // ...
//         };
        // bar和snaf都是Symbol值，导致第三方无法获取到它们，因此达到了私有方法和私有属性的效果
// 8. 私有属性 : es6没有提供 ,前面加上# (目前只是一个提案)
//     class Point {
//         #x;//#x = 1;//私有属性可以指定初始值，在构造函数执行时进行初始化
//
//         constructor(x = 0) {
//         #x = +x; // 写成 this.#x 亦可
//         }
//         get x() { return #x }
//         set x(value) { #x = +value }
//     }
// #x就表示私有属性x，在Point类之外是读取不到这个属性的。还可以看到，私有属性与实例的属性是可以同名的（比如，#x与get x()）
// 也可以用来写私有方法
//     class Foo {
//       #a;
//       #b;
//       #sum() { return #a + #b; }
//         printSum() { console.log(#sum()); }
//         constructor(a, b) { #a = a; #b = b; }
//     }

// 9. this的指向
// 类的方法内部如果含有this，它默认指向类的实例,单独使用方法会报错
//     class Logger {
//         printName(name = 'there') {
//             this.print(`Hello ${name}`);
//         }
//
//         print(text) {
//             console.log(text);
//         }
//     }
//     const logger = new Logger();
//     const { printName } = logger;
//     printName(); // TypeError: Cannot read property 'print' of undefined
// 解决方法:
// 9.1 在构造方法中绑定this，这样就不会找不到print方法
//     class Logger {
//         constructor() {
//             this.printName = this.printName.bind(this);
//         }
//     }
// 9.2 使用箭头函数
//     class Logger {
//         constructor() {
//             this.printName = (name = 'there') => {
//                 this.print(`Hello ${name}`);
//             };
//         }
//     }
// 9.3 使用Proxy，获取方法的时候，自动绑定this
//     function selfish (target) {
//         const cache = new WeakMap();
//         const handler = {
//             get (target, key) {
//                 const value = Reflect.get(target, key);
//                 if (typeof value !== 'function') {
//                     return value;
//                 }
//                 if (!cache.has(value)) {
//                     cache.set(value, value.bind(target));
//                 }
//                 return cache.get(value);
//             }
//         };
//         const proxy = new Proxy(target, handler);
//         return proxy;
//     }
//     const logger = selfish(new Logger());

// 10. name的属性 : 构造函数的许多特性都被Class继承，包括name属性
// name属性总是返回紧跟在class关键字后面的类名
class Pointed {}; console.log(Pointed.name); // "Pointed"

// 11. class 的取值函数（getter）和存值函数（setter）
// 在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为
        class MyProp {
            constructor() {
                // ...
            }
            get prop() {
                return 'getter';
            }
            set prop(value) {
                console.log('setter: '+value);
            }
        }
        let it = new MyProp();
        it.prop = 123;// setter: 123
        console.log(it.prop);// 'getter'
    // prop属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了
// 存值函数和取值函数是设置在属性的 Descriptor 对象上的
        var descriptor = Object.getOwnPropertyDescriptor(
            MyProp.prototype, "prop"
        );
        console.log("get" in descriptor);  // true
        console.log("set" in descriptor);  // true
// 存值函数和取值函数是定义在prop属性的描述对象上面

// 12. class 的 Generator 方法
// 某个方法之前加上星号（*），就表示该方法是一个 Generator 函数
    class Fool {
        constructor(...args) {
            this.args = args;
        }
        * [Symbol.iterator]() {
            for (let arg of this.args) {
                yield arg;
            }
        }
    }
    for (let x of new Fool('hello', 'world')) {
        console.log(x);
    }
    // hello
    // world
// Fool类的Symbol.iterator方法前有一个星号，表示该方法是一个 Generator 函数。
// Symbol.iterator方法返回一个Foo类的默认遍历器，for...of循环会自动调用这个遍历器


// 13. class 的静态方法
// 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，
// 就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”
//         class Fooy {
//             static classMethod() {
//                 return 'hello';
//             }
//         }
//         Fooy.classMethod() // 'hello'
//         var foo = new Fooy();
//         foo.classMethod()
//         // TypeError: foo.classMethod is not a function
// 父类的静态方法，可以被子类继承
        class Foox {
            static classMethod() {
                return 'hello';
            }
        }
        class Bars extends Foox {
        }
        console.log(Bars.classMethod()); // 'hello'
        // 父类Foo有一个静态方法，子类Bar可以调用这个方法
// 静态方法也是可以从super对象上调用的
    class Foog {
        static classMethod() {
            return 'hello';
        }
    }
    class Barx extends Foog {
        static classMethod() {
            return super.classMethod() + ', too';
        }
    }
    console.log(Barx.classMethod()); // "hello, too"

// 14. class 的静态属性和实例属性
// 静态属性指的是 Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性
        class F {}
        F.prop = 1;
        F.prop // 1
// 只有这种写法可行，因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性
// 目前有一个静态属性的提案，对实例属性和静态属性都规定了新的写法(具体没实施)
// 1）类的实例属性: 类的实例属性可以用等式，写入类的定义之中
//         class M {
//             myProp = 42;
//
//             constructor() {
//                 console.log(this.myProp); // 42
//             }
//         }
        // 上面代码中，myProp就是MyClass的实例属性。在MyClass的实例上，可以读取这个属性
// 2）类的静态属性: 类的静态属性只要在上面的实例属性写法前面，加上static关键字就可以了
//         class MyClass {
//             static myStaticProp = 42;
//             constructor() {
//                 console.log(MyClass.myStaticProp); // 42
//             }
//         }
//*********************上面只是提案*************************


// 15. new.target属性
// 15.1 new是从构造函数生成实例的命令。
//      ES6 为new命令引入了一个new.target属性，该属性一般用在在构造函数之中，返回new命令作用于的那个构造函数。
//      如果构造函数不是通过new命令调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的
//     function Person(name) {
//         if (new.target !== undefined) {
//             this.name = name;
//         } else {
//             throw new Error('必须使用new生成实例');
//         }
//     }
//     // 另一种写法
//     function Person(name) {
//         if (new.target === Person) {
//             this.name = name;
//         } else {
//             throw new Error('必须使用 new 生成实例');
//         }
//     }
//     var person = new Person('张三'); // 正确
//     var notAPerson = Person.call(person, '张三');  // 报错
//     //代码确保构造函数只能通过new命令调用

// 15.2 class 内部调用new.target，返回当前 class
        class Rectangle {
            constructor(length, width) {
                console.log(new.target === Rectangle);//true
                this.length = length;
                this.width = width;
            }
        }
        var obj = new Rectangle(3, 4); // 输出 true
// 注意: 子类继承父类时，new.target会返回子类,
//      在函数外部，使用new.target会报错
        class Rectangled {
            constructor(length, width) {
                console.log(new.target === Rectangled);
                // ...
            }
        }
        class Squares extends Rectangled {
            constructor(length) {
                super(length, length);
            }
        }
        var objSub = new Squares(3); // 输出 false   new.target会返回子类
// 利用这个特点，可以写出不能独立使用、必须继承后才能使用的类
    class Shapes {
        constructor() {
            if (new.target === Shapes) {
                throw new Error('本类不能实例化');
            }
        }
    }

    class Rectangles extends Shapes {
        constructor(length, width) {
            super();
            // ...
        }
    }
    // var x = new Shapes();  // 报错  Error: 本类不能实例化
    var y = new Rectangles(3, 4);  // 正确
    // 上面代码中，Shape类不能被实例化，只能用于继承














