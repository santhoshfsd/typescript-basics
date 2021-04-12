
//interface

interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number
}

function validate(validatableInput: Validatable) {

    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }

    if (validatableInput.minLength != null && typeof (validatableInput.value) === 'string') {
        isValid = isValid && validatableInput.minLength < validatableInput.value.trim().length;
    }

    if (validatableInput.maxLength != null && typeof (validatableInput.value) === 'string') {
        isValid = isValid && validatableInput.maxLength > validatableInput.value.trim().length;
    }

    if (validatableInput.min != null && typeof (validatableInput.value) === 'number') {
        isValid = isValid && validatableInput.value > validatableInput.min
    }

    if (validatableInput.max != null && typeof (validatableInput.value) === 'number') {
        isValid = isValid && validatableInput.value < validatableInput.max
    }

    return isValid;
}

//decorator
function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const bound = originalMethod.bind(this);
            return bound
        }
    }
    return adjDescriptor
}

// Project List Class


class ProjectList {
    
        templateElement: HTMLTemplateElement;
        hostElement: HTMLDivElement;
        element: HTMLElement;      
        
        constructor(private type:'active'| 'finished') {
            this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement
            this.hostElement = document.getElementById('app')! as HTMLDivElement
    
            //DocumentFragment type
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild! as HTMLElement;
            this.element.id = `${this.type}-projects`;
            this.attach();
            this.renderContent();
           }

           private renderContent() {
               const listId = `${this.type}-projects-list`;
               this.element.querySelector('ul')!.id =  listId;
               this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' Projects';
           }

           private attach() {
            // afterbegin afterend  /before
            this.hostElement.insertAdjacentElement('beforeend', this.element);
        }    
}
 
// Project input
class ProjectInput {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleElement: HTMLInputElement;
    descriptionElement: HTMLInputElement
    ownerElement: HTMLInputElement
    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        //DocumentFragment type
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as HTMLFormElement;
        this.element.id = "user-input";

        this.titleElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionElement = this.element.querySelector('#description') as HTMLInputElement;
        this.ownerElement = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
        this.attach();
    }

    private attach() {
        // afterbegin afterend  /before
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }

    private getUserData(): [string, string, number] | void {
        const title = this.titleElement.value;
        const description = this.descriptionElement.value;
        const owner = this.ownerElement.value;

        const titleValidatable :Validatable = {
            value: title, required: true, minLength:5
        } 

        const descriptionValidatable :Validatable = {
            value: description, required: true, minLength:5
        } 

        const ownerValidatable :Validatable = {
            value: +owner, required: true, min:1, max:5
        } 

        if(!validate(titleValidatable) || 
        !validate(descriptionValidatable) || !validate(ownerValidatable)) {
            alert("Invalid Input");
            return;
        }
        return [title, description, +owner]
    }


    @autoBind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.getUserData();
        if (Array.isArray(userInput)) {
            const [title, description, owner] = userInput
            console.log(title);
            console.log(description);
            console.log(owner);

        }

    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }
}

const project = new ProjectInput();
const active = new ProjectList('active')
const finish = new ProjectList('finished')