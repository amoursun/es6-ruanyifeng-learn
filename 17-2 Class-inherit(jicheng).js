// class 的继承
// class 通过extends 关键字实现继承
// ES5 通过修改原型链实现继承
// class 比 ES5 继承要清晰和方便很多
//     class Point {};
//     class SubPoint extends Point {};
//     // 定义的SubPoint类通过extends关键字继承Point类所有的属性和方法
//     // 它们没有部署任何代码，所以这两个类完全一样，等于复制了一个Point类
// 子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，
// 而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。
// ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）
// ES6 的继承机制完全不同，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。
// 如果子类没有定义constructor方法，这个方法会被默认添加，并且会默认添加super方法
class Person {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        console.log(this.x + ' ' + this.y);
        console.log(new.target.name);
    }
}
// class SubPerson extends Person {};
// let person = new SubPerson(1, 2);//1 2
//     class SubPerson extends Person {
//         //noinspection JSAnnotator
//         constructor (x, y) {
//
//         }
//     };
//     let person = new SubPerson(1, 2);// ReferenceError: this is not defined
// 在子类的构造函数中，只有调用super之后，才可以使用this关键字，并且this指向子类 , 否则会报错
    class SubPerson extends Person {
        //noinspection JSAnnotator
        constructor (x, y) {
            super(x, y);//调用父类的constructor(x, y)
        }
    };
    let person = new SubPerson(1, 2);//1 2
// 实例对象person同时是SubPerson 和 Person 两个类的实例,与ES5 的行为完全一致


// 2. Object.getPrototypeOf() 方法可以用来从子类上获取父类 : 可以判断一个类是否继承了另一个类
console.log(Object.getPrototypeOf(SubPerson) === Person);//true


// 3. super关键字 : 既可以当作函数使用，也可以当作对象使用
//(1)当函数使用:
//     super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数,才可以使用this
//     super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B，
//     因此super()在这里相当于A.prototype.constructor.call(this)
//     super()只能用在子类的构造函数之中，用在其他地方就会报错
    new Person(1,2);// new.target.name ==> Person
    new SubPerson(1,2);// new.target.name ==> SubPerson
//(2)当对象使用:
//     super 在普通方法中，指向父类的原型对象；在静态方法中，指向父类
//   普通方法中:
//     由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的
//     属性或者方法 定义在父类的原型对象上，super就可以取到
//     ES6 规定，通过super调用父类的方法时，super会绑定子类的this
//     由于绑定子类的this，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性
//   静态方法中:
//     super将指向父类，而不是父类的原型对象
// 普通方法中代码示例:
class A1 {
    p() {
        return 2;
    }
}
class B1 extends A1 {
    constructor() {
        super();
        console.log(super.p()); // 2
    }
}
let b1 = new B1();//2 子类B当中的super.p()，就是将super当作一个对象使用,指向A.prototype,相当于A.prototype.p()
  //========================================
    class A2 {
        constructor() {
            this.p = 2;//p是父类实例(this)上的属性
            this.w = 5;
        }
        print() {
            console.log(this.w);
        }
    }
    A2.prototype.x = 3;
    A2.prototype.methodx = function (){
       console.log('父类的原型对象上的方法被super取到了');
    };
    class B2 extends A2 {
        //noinspection JSAnnotator
        constructor() {
            super();
            this.w = 20;
            this.e = 33;
            super.e = 100;
            console.log(super.e);//undefined 读取super.x的时候，读的是A.prototype.x，所以返回undefined
            console.log(this.e);//100 不是33,是100 通过super对某个属性赋值，这时super就是this
        }
        get m() {
            return super.p;
        }
        pt() {
            super.print();
        }
    }
    let b2 = new B2();
    console.log(b2.m); // undefined  super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的
    console.log(b2.x); // 3
    b2.methodx();// '父类的原型对象上的方法被super取到了'
    b2.pt();// 20  super.print()虽然调用的是A2.prototype.print()，但是A2.prototype.print()会绑定子类B2的this，
            //     导致输出的是20, 而不是5,因为执行的是super.print.call(this)

//  静态方法中的代码示例:
class Parent {
    static myMethod(msg) {
        console.log('static', msg);
    }
    myMethod(msg) {
        console.log('instance', msg);
    }
}
class Child extends Parent {
    static myMethod(msg) {
        super.myMethod(msg);//指向父类
    }
    myMethod(msg) {
        super.myMethod(msg);//指向父类的原型对象,  new关键字
    }
}
Child.myMethod(1); // static 1
var child = new Child();
child.myMethod(2); // instance 2

// 注意: 使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错
        class Ax {}
        class Bx extends Ax {
            constructor() {
                super();
                // console.log(super); // 报错  无法看出是作为函数使用，还是作为对象使用
                console.log(super.valueOf() instanceof Bx); // true
                // super.valueOf()表明super是对象,不会报错  super绑定B的this, super.valueOf()返回的是一个B的实例
            }
        }
        let bx = new Bx();



// 4. class 类的 prototype 属性和__proto__属性
// Class 作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链
// （1）子类的__proto__属性，表示构造函数的继承，总是指向父类
// （2）子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性
//  (3) 实例的 __proto__ 属性: 子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性,即子类的原型的原型，是父类的原型
    class Apro {}
    class Bpro extends Apro {}
    var p1 = new Apro();
    var p2 = new Bpro();
    console.log(Bpro.__proto__ === Apro); // true
    console.log(Bpro.prototype.__proto__ === Apro.prototype); // true
    console.log(p2.__proto__ === p1.__proto__); // false
    console.log(p2.__proto__ === p1);//false
    console.log(p2.__proto__.__proto__ === p1.__proto__); // true
// p2.__proto__.__proto__ 上添加方法影响到了 Apro的实例p1
// 子类B的__proto__属性指向父类A，子类B的prototype属性的__proto__属性指向父类A的prototype属性
    class AA {}
    class BB {}
    // BB 的实例继承 AA 的实例
    Object.setPrototypeOf(BB.prototype, AA.prototype);
    // BB 的实例继承 AA 的静态属性
    Object.setPrototypeOf(BB, AA);
    const bb = new BB();
    Object.setPrototypeOf = function (obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }
    Object.setPrototypeOf(BB.prototype, AA.prototype); // 等同于  BB.prototype.__proto__ = AA.prototype;
    Object.setPrototypeOf(BB, AA); // 等同于 BB.__proto__ = AA;
    // 这两条继承链，可以这样理解：作为一个对象，子类（B）的原型（__proto__属性）是父类（A）；
    //                       作为一个构造函数，子类（B）的原型（prototype属性）是父类的实例。
    Object.create(AA.prototype); // 等同于  BB.prototype.__proto__ = AA.prototype;

// 4.2  extends 关键字 的继承目标 : 它后面可以跟多种类型的值
// class B extends A {} : A只要是一个有prototype属性的函数，就能被B继承,A可以为任意函数(除了Function.prototype函数)
//                        A 也可以是原生的构造函数(String, Boolean, Date .......)
// 第一种特殊情况，子类继承Object类:
//         class A extends Object {};
//         A.__proto__ === Object // true
//         A.prototype.__proto__ === Object.prototype // true
//         //A其实就是构造函数Object的复制，A的实例就是Object的实例
// 第二种特殊情况，不存在任何继承:
//     class A {}
//     A.__proto__ === Function.prototype // true
//     A.prototype.__proto__ === Object.prototype // true
//     //A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype
//     //A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性
// 第三种特殊情况，子类继承null:
    class C extends null {};
    console.log(C.__proto__ === Function.prototype); // true
    console.log(C.prototype.__proto__ === undefined); // true
//     //A也是一个普通函数，所以直接继承Function.prototype
//     //A调用后返回的对象不继承任何方法，所以它的__proto__指向Function.prototype
//         class C extends null {
//             constructor() { return Object.create(null); }
//         }


// 5. 原生构造函数的继承: 指语言内置的构造函数,并且原生构造函数是无法继承的
//     Boolean()
//     Number()
//     String()
//     Array()
//     Date()
//     Function()
//     RegExp()
//     Error()
//     Object()
// ES5 是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。
// 比如，Array构造函数有一个内部属性[[DefineOwnProperty]]，用来定义新属性时，更新length属性，这个内部属性无法在子类获取，
//      导致子类的length属性行为不正常
// ES6 允许继承原生构造函数定义子类，
// 因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承
//          (1)ES6 可以自定义原生数据结构（比如Array、String等）的子类
// ES6例子:
    // 继承Array():
    //         class MyArray extends Array {
    //             constructor(...args) {
    //                 super(...args);
    //             }
    //         }
    //         var arr = new MyArray();
    //         arr[0] = 12;
    //         console.log(arr.length); // 1
    //         arr.length = 0;
    //         console.log(arr[0]); // undefined
        // MyArray类继承了Array构造函数，因此就可以从MyArray生成数组的实例
    // 定义了一个带版本功能的数组
    //         class VersionedArray extends Array {
    //             constructor() {
    //                 super();
    //                 this.history = [[]];
    //             }
    //             commit() {
    //                 this.history.push(this.slice());
    //             }
    //             revert() {
    //                 this.splice(0, this.length, ...this.history[this.history.length - 1]);
    //             }
    //         }
    //         var x = new VersionedArray();
    //         x.push(1);
    //         x.push(2);
    //         console.log(x); //[1,2] VersionedArray [ 1, 2, history: [ [] ] ]
    //         console.log(x.history); // [[]]
    //
    //         x.commit();
    //         console.log(x.history); //[[], [1, 2]]   [ [], VersionedArray [ 1, 2, history: [ [] ] ] ]
    //
    //         x.push(3);
    //         console.log(x); // [1, 2, 3]    VersionedArray [1,2,3,history: [[], VersionedArray [1,2,history:[Object]]]]
    //         console.log(x.history); // [[], [1, 2]]  [ [], VersionedArray [ 1, 2, history: [ [] ] ] ]
    //
    //         x.revert();
    //         console.log(x); // [1, 2]    VersionedArray [1,2,history: [[], VersionedArray [1, 2, history:[Object]]]]
    //     VersionedArray会通过commit方法，将自己的当前状态生成一个版本快照，存入history属性
    //     revert方法用来将数组重置为最新一次保存的版本。除此之外，VersionedArray依然是一个普通数组，
    //     所有原生的数组方法都可以在它上面调用


// 6. Mixin 模式的实现 : 将多个类的接口“混入”（mixin）另一个类
function mix(...mixins) {
    class Mix {}

    for (let mixin of mixins) {
        copyProperties(Mix, mixin);
        copyProperties(Mix.prototype, mixin.prototype);
    }

    return Mix;
}
function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if ( key !== "constructor"
            && key !== "prototype"
            && key !== "name"
        ) {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}
// mix函数可以将多个对象合成为一个类,使用的时候，只要继承这个类即可
class DistributedEdit extends mix(Loggable, Serializable) {/*...*/}































