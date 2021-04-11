type Admin = {
    name:string;
    privilege: string[]
}

type Employee = {
    name: string;
    startdate: Date
}

type ElevatedType = Admin & Employee;


const emp:ElevatedType = {
    name:"s",
    privilege:["can"],
    startdate: new Date()
}

// union type
type Combinable = string | number;
type Numeric = number | boolean;

// intersection type
type Universal = Combinable & Numeric;


type Horse=  {
type :"horse",
runningSpeed: number
}
 
type Bird=  {
    type :"bird",
    flyingSpeed:number
}

type Animal = Horse | Bird;

function mveAnimanl(animal: Animal) {
    switch(animal.type) {
        case "horse":
            break;
            case "bird":
            break
    }   
}

const paragraph = <HTMLInputElement> document.querySelector('#test');
paragraph.nodeValue = "test"


const paragraphs=   document.querySelector('#test')! as HTMLInputElement; 

