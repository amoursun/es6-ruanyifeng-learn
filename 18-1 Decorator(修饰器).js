
// 1. 类的修饰
// 修饰器（Decorator）是一个函数，用来修改类的行为。ES2017 引入了这项功能，目前 Babel 转码器已经支持。
@testable //ES6 暂时不支持
class MyTestableClass {
    // ...
}
function testable(target) {
    target.isTestable = true;
}
console.log(MyTestableClass.isTestable); // true
// @testable就是一个修饰器。它修改了MyTestableClass这个类的行为，为它加上了静态属性isTestable
// 修饰器的行为如:
    @decorator
    class A {}
    // 等同于
    class A {}
    A = decorator(A) || A;





























































