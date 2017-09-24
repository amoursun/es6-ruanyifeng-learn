// 1. 浏览器加载
// 浏览器通过<script>标签加载 JavaScript 脚本
// 默认情况下，浏览器是同步加载 JavaScript 脚本，即渲染引擎遇到<script>标签就会停下来，等到执行完脚本，再继续向下渲染
// 异步加载的语法: <script>标签打开defer或async属性，脚本就会异步加载
//     <script src="path/to/myModule.js" defer></script>
//     <script src="path/to/myModule.js" async></script>
// defer与async的区别是：
//     前者要等到整个页面正常渲染结束，才会执行；(渲染完执行)
//     后者一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染 (下载完执行)
//     如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的
// 加载规则
// 浏览器加载 ES6 模块，也使用<script>标签，但是要加入type="module"属性
// <script type="module" src="foo.js"></script>
//     上面代码在网页中插入一个模块foo.js，由于type属性设为module，所以浏览器知道这是一个 ES6 模块。
// 浏览器对于带有type="module"的<script>，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，
// 等同于打开了<script>标签的defer属性
// <script>标签的async属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。
// <script type="module" src="foo.js" async></script>



// 2. ES6 模块与 CommonJS 模块的差异
//         CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
//         CommonJS 模块是运行时加载，ES6 模块是编译时输出接口
// 第一个差异 CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
// 第二个差异是因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。
// 而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成


















