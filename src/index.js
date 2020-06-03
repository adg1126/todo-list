let container = document.getElementById('container');
let projectIntputBurger = container.children[0];
let projectInputs = container.children[1];
let projectDisplay = container.children[2];

let project = projectInputs.querySelector('#project');
let description = projectInputs.querySelector('#description');
let dueDate = projectInputs.querySelector('#notes');
let notes = projectInputs.querySelector('#due-date');

let btn = projectInputs.children[1];
let select = container.children[2].children[0];
let ul = container.children[2].children[1].children[0];
let li = ul.children;

document.addEventListener('DOMContentLoaded', () => {
    getProjects(), checkCompletedProject(), getTodos(), checkCompletedTodo();
});
btn.addEventListener('click', addProject);
ul.addEventListener('click', markRemovePrj);
document.addEventListener('click', addMarkRemoveTodo);
select.addEventListener('change', filterTodos);
projectIntputBurger.addEventListener('click', projectInputSlide);

dueDate.setAttribute('min', `${new Date().toISOString().split("T")[0]}`);

function projectInputSlide() {
    projectInputs.classList.toggle('active');
    projectDisplay.classList.toggle('active');
}

function expandProject() {
    [...ul.children].forEach(li => {
        li.querySelector('.burger').addEventListener('click', addActive);
    });
}

function addActive(e) {
    let li = e.target.closest('li');
    let liContent = li.children[2];
    let todoListContainer = liContent.children[3];
    li.classList.toggle('active');
    liContent.classList.toggle('active');
    todoListContainer.classList.toggle('active');
    li.querySelector('.burger').classList.toggle('x');
}

function addProject() {
    if (project.value == '') {
        project.setAttribute('placeholder', '');
    } else {
        saveToLocalStorage({project: project.value, description: description.value, 
            dueDate: dueDate.value, notes: notes.value, status: 'Uncompleted', todos: [] });

        let li = `<li>
            <div class='project-name'>${project.value}</div>
            <div class='burger'>
                <div class='line1'></div>
                <div class='line2'></div>
                <div class='line3'></div>
            </div>
            <div class='li-content'>
                <div class='li-item' id='description-content'>Description: ${description.value}</div>
                <div class='li-item' id='dueDate-content'>Due Date: ${dueDate.value}</div>
                <div class='li-item' id='notes-content'>Notes: ${notes.value}</div>
                <div class='li-tem' id='todo-list-containert'>
                    <ul id='todo-list'>Todo list:</ul>
                    <div class='form'>
                        <div class="todo-section">
                            <input id="todo-input" type="text" autocomplete="off" required />
                            <label for="text" class="label-name">
                                <span class="content-name">Todo</span>
                            </label>
                        </div>  
                    </div>
                    <button class='add-todo'>Add Todo</button>
                </div>
            </div>
        <button class='mark-as-completed'>Completed</button>
        <button class='remove'>Remove</button>`;
        ul.innerHTML += li;
        project.value = '', description.value = '', dueDate.value = '', notes.value = '';
        expandProject();
    }
}

function markRemovePrj(e) {
    let i = [...li].findIndex(element => element == e.target.parentNode);
    if (e.target.className == 'mark-as-completed') {
        markProject(i);
        e.target.parentNode.querySelector('.project-name').style.textDecoration = 'line-through';
        e.target.parentNode.querySelector('.mark-as-completed').remove();
    } if (e.target.className == 'remove') {
        removeProject(i);
        e.target.parentNode.classList.add('fall');
        e.target.parentNode.addEventListener("transitionend", () => {
            e.target.parentNode.remove();
        });
    } 
}

function addMarkRemoveTodo(e) {
    if (e.target.className == 'add-todo') {
        let todoInput = e.target.parentNode.querySelector('#todo-input');

        if (todoInput.value == '') {
            todoInput.setAttribute('placeholder', '');
        } else {
            let projectIndex = [...ul.children].indexOf(e.target.closest('li'));
            saveTodo(projectIndex, {todo: todoInput.value, status: 'Uncompleted'});
            todoInput.value = '';
        }
    } else if (e.target.className == 'mark-todo-as-completed') {
        let projectIndex = [...ul.children].indexOf(e.target.closest('li.active'));
        let todoIndex = [...e.target.closest('ul').children].indexOf(e.target.parentNode);
        e.target.previousElementSibling.style.textDecoration = 'line-through';
        e.target.remove();
        markTodo(projectIndex, todoIndex);
    } else if (e.target.className == 'remove-todo') {
        let projectIndex = [...ul.children].indexOf(e.target.closest('li.active'));
        let todoIndex = [...e.target.closest('ul').children].indexOf(e.target.parentNode);
        removeTodo(projectIndex, todoIndex);
        e.target.parentNode.classList.add('fall');
        e.target.parentNode.addEventListener("transitionend", () => {
            e.target.parentNode.remove();
        });
    } 
}

function filterTodos(e) {
    [...ul.children].forEach(li => {
        if (e.target.value == 'all') {
            li.style.display = 'block';
        } else if (e.target.value == 'completed') {
            (li.children[0].style.textDecoration == 'line-through') ? li.style.display = 'block' 
                : li.style.display = 'none';
        } else if (e.target.value == 'uncompleted') {
            (li.children[0].style.textDecoration != 'line-through') ? li.style.display = 'block' 
                : li.style.display = 'none';
        } 
    });
}

function saveToLocalStorage(project) {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));

    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
}

function getProjects() {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));

    projects.forEach(project => {
        if (project.value == '') {
            project.setAttribute('placeholder', '');
        } else {
            let li = `<li>
                <div class='project-name'>${project.project}</div>
                <div class='burger'>
                    <div class='line1'></div>
                    <div class='line2'></div>
                    <div class='line3'></div>
                </div>
                <div class='li-content'>
                    <div class='li-item' id='description-content'>Description: ${project.description}</div>
                    <div class='li-item' id='dueDate-content'>Due Date: ${project.dueDate}</div>
                    <div class='li-item' id='notes-content'>Notes: ${project.notes}</div>
                    <div class='li-tem' id='todo-list-containert'>
                        <ul id='todo-list'>Todo list:</ul>
                        <div class='form'>
                            <div class="todo-section">
                                <input id="todo-input" type="text" autocomplete="off" required />
                                <label for="text" class="label-name">
                                    <span class="content-name">Todo</span>
                                </label>
                            </div>  
                        </div>
                        <button class='add-todo'>Add Todo</button>
                    </div>
                </div>
            <button class='mark-as-completed'>Completed</button>
            <button class='remove'>Remove</button>`;
            ul.innerHTML += li;
            expandProject();
        }
    });
}

function removeProject(index) {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));

    projects.splice(index, 1);
    localStorage.setItem('projects', JSON.stringify(projects));
}

function markProject(index) {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));

    projects[index].status = 'Completed';
    localStorage.setItem('projects', JSON.stringify(projects));
}

function checkCompletedProject() {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));

    projects.forEach((project, i) => {
        if (project.status == 'Completed') {
            li[i].children[0].style.textDecoration = 'line-through';
            li[i].children[2].remove();
        }
    });
    localStorage.setItem('projects', JSON.stringify(projects));
}

function saveTodo(projectIndex, todoObj) {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));

    projects[projectIndex].todos.push(todoObj);
    let todoLi = `<li>
    <div class='todo-name'>${todoObj.todo}</div>
        <button class='mark-todo-as-completed'>Completed</button>
        <button class='remove-todo'>Remove</button>
    </li>`;
    li[projectIndex].querySelector('#todo-list').innerHTML += todoLi;
    localStorage.setItem('projects', JSON.stringify(projects));
}

function getTodos() {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));
    
    projects.forEach((project, i) => {
        project.todos.forEach(todo => {
            let todoLi = `<li>
            <div class='todo-name'>${todo.todo}</div>
                <button class='mark-todo-as-completed'>Completed</button>
                <button class='remove-todo'>Remove</button>
            </li>`;
            li[i].querySelector('#todo-list').innerHTML += todoLi;
        })
    });
}

function removeTodo(projectIndex, todoIndex) {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));

    projects[projectIndex].todos.splice(todoIndex, 1);
    localStorage.setItem('projects', JSON.stringify(projects));
}

function markTodo(projectIndex, todoIndex) {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));

    projects[projectIndex].todos[todoIndex].status = 'Completed';
    localStorage.setItem('projects', JSON.stringify(projects));
}

function checkCompletedTodo() {
    let projects = (localStorage.getItem('projects') == null) ? []
        : JSON.parse(localStorage.getItem('projects'));

    projects.forEach((project, i) => {
        project.todos.forEach((todo, j) => {
            if (todo.status == 'Completed') {
                let todoLi = li[i].querySelector('ul').children[j];
                todoLi.children[0].style.textDecoration = 'line-through';
                todoLi.children[1].remove();
            }
        })
    });
    localStorage.setItem('projects', JSON.stringify(projects));
}
