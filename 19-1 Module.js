// 使用export命令定义了模块的对外接口以后，其他 JS 文件就可以通过import命令加载这个模块

// export default 命令: 默认输出是一个函数
// 默认输出和正常输出比较:
//     //第一组
//     export default function crc32() { // 输出
//                                       // ...
//     }
//     import crc32 from 'crc32'; // 输入
//     // 第二组
//     export function crc32() { // 输出
//                               // ...
//     };
//     import {crc32} from 'crc32'; // 输入
//     // 第一组是使用export default时，对应的import语句不需要使用大括号；第二组是不使用export default时，对应的import语句需要使用大括号
// export default命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此export default命令只能使用一次。
// 所以，import命令后面才不用加大括号，因为只可能对应一个方法

// 7. export 与 import 的复合写法
//         export { foo, bar } from 'my_module';
//         // 等同于
//         import { foo, bar } from 'my_module';
//         export { foo, bar };
//     // 接口改名
//     export { foo as myFoo } from 'my_module';
//
//     // 整体输出
//     export * from 'my_module';
//     默认接口的写法如下
//     export { default } from 'foo';
//     具名接口改为默认接口的写法如下
//     export { es6 as default } from './someModule';
//     // 等同于
//     import { es6 } from './someModule';
//     export default es6;


// 8.模块的继承
// export *，表示再输出circle模块的所有属性和方法。注意，export *命令会忽略circle模块的default方法

// 9. 跨模块常量
//     // constants.js 模块
//     export const A = 1;
//     export const B = 3;
//     export const C = 4;
//     // test1.js 模块
//     import * as constants from './constants';
//     console.log(constants.A); // 1
//     console.log(constants.B); // 3
//     // test2.js 模块
//     import {A, B} from './constants';
//     console.log(A); // 1
//     console.log(B); // 3
//     //constants目录，将各种常量写在不同的文件里面，保存在该目录下
//     // constants/db.js
//     export const db = {
//         url: 'http://my.couchdbserver.local:5984',
//         admin_username: 'admin',
//         admin_password: 'admin password'
//     };
//     // constants/user.js
//     export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];
//     // 将这些文件输出的常量，合并在index.js里面
//     // constants/index.js
//     export {db} from './db';
//     export {users} from './users';
//     // 使用的时候，直接加载index.js就可以了
//     // script.js
//     import {db, users} from './constants';



// 10. import() : 提案
// import()的一些适用场合
// 1）按需加载: import()可以在需要的时候，再加载某个模块
// 2）条件加载: import()可以放在if代码块，根据不同的情况，加载不同的模块
// 3）动态的模块路径: import()允许模块路径动态生成
// 注意: import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数
//      import()也可以用在 async 函数之中

































