
// Drag and Drop Interface

interface Draggable {
  dragStartHandler(event:DragEvent):void
  dragEndHandler(event:DragEvent):void;
}

interface DragTarget {
    dragOverHandler(event:DragEvent):void;
    dropHandler(event:DragEvent):void;
    dragLeaveHandler(event:DragEvent):void;
}

enum ProjectStatus {
    Active,
    Finished
}

class Project {
    constructor(public id: string,public title: string, public description: string, public people: number, public status: ProjectStatus) {

    }
}

class State<T> {
    
    protected listeners: Listener<T>[] = [];

    addListeners(listerFn: Listener<T>) {
        this.listeners.push(listerFn)
    }
}

type Listener<T> = (items: T[]) => void 

// State 
class ProjectState extends State<Project>{
    private projects: Project[] = []
    private static instance: ProjectState;

    private constructor() {
        super();
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

// Base Component


abstract class Component<T extends HTMLElement ,U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T; 
    element: U;
    constructor(templateId :string, hostElementId: string,insertAtStart:boolean, newElementId?: string) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement
        this.hostElement = document.getElementById(hostElementId)! as T

        //DocumentFragment type
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as U;
        if(newElementId){
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    private attach(insertAtStart:boolean) {
        // afterbegin afterend  /before
        this.hostElement.insertAdjacentElement(insertAtStart?'afterbegin':'beforeend', this.element);
    }

    abstract configure(): void;
    abstract renderContent(): void;
} 

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>  implements Draggable{
    project: Project;

    get persons() {
      if(this.project.people ===1) {
        return "1 person"
      } else {
        return `${this.project.people} persons`
      }
    }
    configure(): void {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragstart', this.dragStartHandler);
    }

    constructor(hostId: string, project : Project){
        super('single-project',hostId,false,project.id);
        this.project = project;            
        this.configure();
        this.renderContent();
        }

  @autoBind      
  dragStartHandler(event: DragEvent): void {
    console.log(event);
    
  }

  dragEndHandler(_: DragEvent): void {
  console.log("drag end");
  
  }

    renderContent():void {
        this.element.querySelector('p')!.textContent = this.project.description;
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned'
    }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  configure() {
    projectState.addListeners((projects: Project[]) => {
      const relevantProjects = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
    }
  }
}


// Project input
class ProjectInput extends Component<HTMLDivElement, HTMLElement>{;
    titleElement: HTMLInputElement;
    descriptionElement: HTMLInputElement
    peopleElement: HTMLInputElement
    
    constructor() {
        super('project-input','app',true,'user-input')
  
        this.titleElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleElement = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }

    renderContent() {

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
}

const project = new ProjectInput();
const active = new ProjectList('active')
const finish = new ProjectList('finished')