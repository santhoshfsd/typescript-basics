interface Greetable {
    name: string;
    greet(phrase : string):void;
}


class Person implements Greetable {
    name: string;
    greet(phrase: string): void {
        throw new Error("Method not implemented.");
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
        console.log("phrase");
        
    },
    age:10
} 