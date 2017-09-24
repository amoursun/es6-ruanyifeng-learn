// import 用于加载profile.js文件,命令接受一对大括号，里面指定要从其他模块导入的变量名。
// 大括号里面的变量名，必须与被导入模块（profile.js）对外接口的名称相同

// import后面的from指定模块文件的位置，可以是相对路径，也可以是绝对路径，
// .js路径可以省略。如果只是模块名，不带有路径，那么必须有配置文件
// import 'lodash';代码仅仅执行lodash模块，但是不输入任何值
// 多次重复执行同一句import语句，那么只会执行一次，而不会执行多次

// 注意: import命令具有提升效果，会提升到整个模块的头部，首先执行
//      import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构
//         // 报错
//         import { 'f' + 'oo' } from 'my_module';
//
//         // 报错
//         let module = 'my_module';
//         import { foo } from module;
//
//         // 报错
//         if (x === 1) {
//         import { foo } from 'module1';
//         } else {
//         import { foo } from 'module2';
//         }
//         //表达式、变量和if结构均会报错
import {firstName, lastName, year} from './profile';
function setName(element) {
    element.textContent = firstName + ' ' + lastName + '是' + 'year' + '出生';
    console.log(element.textContent);
}
setName(div);
// import * as circle from './circle';//模块整体加载
