
//decorator
function autoBind(_:any, _2:string, descriptor:PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable:true,
        get(){
            const bound = originalMethod.bind(this);
            return bound
        }
    }
    return adjDescriptor
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

    private getUserData():[string, string,number] | void {
        const title = this.titleElement.value;
        const description = this.descriptionElement.value;
        const owner = this.ownerElement.value;
        
        if(title.trim().length === 0  || description.trim().length === 0 || owner.trim().length === 0) {
            alert("Invalid Input");
            return;
        }
        return [title,description,+owner]
    }


    @autoBind
    private submitHandler(event:Event) {
        event.preventDefault();
        const userInput = this.getUserData();
        if(Array.isArray(userInput)) {
            const [title, description, owner] =userInput
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