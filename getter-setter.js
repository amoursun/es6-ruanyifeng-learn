// getter 是一种获得属性值的方法，setter是一种设置属性值的方法

//demo1
var person = {
    firstName: 'Maks',
    lastName: 'Naire'
};
Object.defineProperty(person, 'fullName',{
   get: function (){
       return this.firstName + ' ' + this.lastName;
   }
});
console.log(person.fullName);//Maks Naire

//demo2
class Person {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }
    setFullName(value) {
        var names = value.split(' ');
        this.firstName = names[0];
        this.lastName = names[1];
        return this.firstName + ' ' + this.lastName;
    }
}
var person = new Person('Maks', 'Nemisj');
console.log(person.fulName);//undefined   虽无fullName,但未报错
console.log(person.getFullName());//Maks Nemisj
console.log(person.setFullName('Xi Jinping'));//setFullName中无return打印undefined, 有return 打印 Xi Jinping
console.log(person.getFullName());//Xi Jinping




//demo3
var obj = {

    val:100,
    get getval(){
        return this.val;
    },
    set setval(x){
        this.val = x;
    }
}
console.log(obj.getval);//100
obj.setval = 101;
console.log(obj.getval);//101

//demo4

var obj2 = {
    val:200
}
obj2.__defineGetter__('name',function(){return this.val});
obj2.__defineSetter__('name',function(name){this.val = name;})
console.log(obj2.name);//200
obj2.name = 201;
console.log(obj2.name);//201


















































































