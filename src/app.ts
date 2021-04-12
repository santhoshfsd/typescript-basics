// Code goes here!
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
        this.ownerElement = this.element.querySelector('#title') as HTMLInputElement;
        this.configure();
        this.attach();
    }

    private attach() {
        // afterbegin afterend  /before
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }

    private submitHandler(event:Event) {
        event.preventDefault();
        console.log(this.titleElement.value);
        
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }
}

const project = new ProjectInput();