
// type addFunction = (one : number, two : number) => number

// anonymous function - as a function type
interface addFunction {
    (a:number, b:number) :number
}
interface Named {
    readonly name: string;
  
}

interface Greetable extends Named{
    greet(phrase : string):void;
}


class Person implements Greetable {
    name: string;
    greet(phrase: string): void {
        throw new Error("Method not implemented."+phrase);
    }
    age:number
    constructor(name :string,age:number) {
        this.name = name;
        this.age = age
    }
}
let user: Person = {
    name:"santhso",
    greet(phrase: string) {
        console.log(phrase);
        
    },
    age:10
} 