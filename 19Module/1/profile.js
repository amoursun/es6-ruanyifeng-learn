// export var firstName = 'Michael';
// export var lastName = 'Jackson';
// export var year = 1980;
// 或者
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1980;
export {firstName, lastName, year};
//export命令除了输出变量，还可以输出函数或类（class）
export function multiply(x, y) {
    return x * y;
};
// export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系
// function和class的输出，也必须遵守这样的写法
//     // 报错
//     function f() {}
//     export f;
//
//     // 正确
//     export function f() {};
//
//     // 正确
//     function f() {}
//     export {f};
// export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值
//     export var foo = 'bar';
//     setTimeout(() => foo = 'baz', 500);
//     //输出变量foo，值为bar，500毫秒之后变成baz
// export语句放在函数之中，结果报错



