
enum ProjectStatus {
    Active,
    Finished
}

class Project {
    constructor(public id: string,public title: string, public description: string, public people: number, public status: ProjectStatus) {

    }
}

type Listener = (items: Project[]) => void 

// State 
class ProjectState {
    private listeners: Listener[] = []
    private projects: Project[] = []
    private static instance: ProjectState;

    private constructor() {
    }


    addListeners(listerFn: Listener) {
        this.listeners.push(listerFn)
    }

    static getInstance() {
        if (this.instance) {
            return this.instance
        } else {
            this.instance = new ProjectState();
            return this.instance
        }
    }
    public addProject(title: string, description: string, noOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, noOfPeople, ProjectStatus.Active)
        this.projects.push(newProject)
        for (const listerFn of this.listeners) {
            listerFn(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();
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
    assignedProject: Project [];

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        //DocumentFragment type
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as HTMLElement;
        this.element.id = `${this.type}-projects`;
        this.assignedProject = [];
        projectState.addListeners((projects: Project[]) => {
            this.assignedProject = projects
            this.renderProject()
        });
        this.attach();
        this.renderContent();
    }

    private renderProject() {
        const listEL = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        for (const proj of this.assignedProject) {
            const listItem = document.createElement('li');
            listItem.textContent = proj.title;
            listEL.appendChild(listItem);
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
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
    peopleElement: HTMLInputElement
    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        //DocumentFragment type
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as HTMLFormElement;
        this.element.id = "user-input";

        this.titleElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleElement = this.element.querySelector('#people') as HTMLInputElement;
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
        const people = this.peopleElement.value;

        const titleValidatable: Validatable = {
            value: title, required: true, minLength: 5
        }

        const descriptionValidatable: Validatable = {
            value: description, required: true, minLength: 5
        }

        const peopleValidatable: Validatable = {
            value: +people, required: true, min: 1, max: 5
        }

        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) || !validate(peopleValidatable)) {
            alert("Invalid Input");
            return;
        }
        return [title, description, +people]
    }


    @autoBind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.getUserData();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
            console.log(title);
            console.log(description);
            console.log(people);

        }

    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }
}

const project = new ProjectInput();
const active = new ProjectList('active')
const finish = new ProjectList('finished')