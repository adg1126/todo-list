const container = document.getElementById('container');
const projectInputBurger = container.children[0];
const projectInputs = container.children[1];
const projectDisplay = container.children[2];

const project = projectInputs.querySelector('#project');
const description = projectInputs.querySelector('#description');
const dueDate = projectInputs.querySelector('#notes');
const notes = projectInputs.querySelector('#due-date');

const btn = projectInputs.children[1];
const select = container.children[2].children[0];
const ul = container.children[2].children[1].children[0];
const li = ul.children;

document.addEventListener('DOMContentLoaded', () => {
  getProjects();
  checkCompletedProject();
  getTodos();
  checkCompletedTodo();
});
btn.addEventListener('click', addProject);
ul.addEventListener('click', markRemovePrj);
document.addEventListener('click', addMarkRemoveTodo);
select.addEventListener('change', filterTodos);
projectInputBurger.addEventListener('click', projectInputSlide);

dueDate.setAttribute('min', `${new Date().toISOString().split('T')[0]}`);

function projectInputSlide() {
  projectInputs.classList.toggle('active');
  projectDisplay.classList.toggle('active');
}

function expandProject() {
  [...ul.children].forEach((e) => {
    e.querySelector('.burger').addEventListener('click', addActive);
  });
}

function addActive(e) {
  const targetli = e.target.closest('li');
  const liContent = targetli.children[2];
  const todoListContainer = liContent.children[3];
  targetli.classList.toggle('active');
  liContent.classList.toggle('active');
  todoListContainer.classList.toggle('active');
  targetli.querySelector('.burger').classList.toggle('x');
}

function addProject() {
  if (project.value === '') {
    project.setAttribute('placeholder', '');
  } else {
    saveToLocalStorage({
      project: project.value,
      description: description.value,
      dueDate: dueDate.value,
      notes: notes.value,
      status: 'Uncompleted',
      todos: [],
    });

    const projectli = `<li>
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
    ul.innerHTML += projectli;
    project.value = '';
    description.value = '';
    notes.value = '';
    expandProject();
  }
}

function markRemovePrj(e) {
  const i = [...ul.children].findIndex(
    (element) => element === e.target.parentNode
  );
  if (e.target.className === 'mark-as-completed') {
    markProject(i);
    e.target.parentNode.querySelector('.project-name').style.textDecoration =
      'line-through';
    e.target.parentNode.querySelector('.mark-as-completed').remove();
  }
  if (e.target.className === 'remove') {
    removeProject(i);
    e.target.parentNode.classList.add('fall');
    e.target.parentNode.addEventListener('transitionend', () => {
      e.target.parentNode.remove();
    });
  }
}

function addMarkRemoveTodo(e) {
  if (e.target.className === 'add-todo') {
    const todoInput = e.target.parentNode.querySelector('#todo-input');

    if (todoInput.value === '') {
      todoInput.setAttribute('placeholder', '');
    } else {
      const projectIndex = [...ul.children].indexOf(e.target.closest('li'));
      saveTodo(projectIndex, { todo: todoInput.value, status: 'Uncompleted' });
      todoInput.value = '';
    }
  } else if (e.target.className === 'mark-todo-as-completed') {
    const projectIndex = [...ul.children].indexOf(
      e.target.closest('li.active')
    );
    const todoIndex = [...e.target.closest('ul').children].indexOf(
      e.target.parentNode
    );
    e.target.previousElementSibling.style.textDecoration = 'line-through';
    e.target.remove();
    markTodo(projectIndex, todoIndex);
  } else if (e.target.className === 'remove-todo') {
    const projectIndex = [...ul.children].indexOf(
      e.target.closest('li.active')
    );
    const todoIndex = [...e.target.closest('ul').children].indexOf(
      e.target.parentNode
    );
    removeTodo(projectIndex, todoIndex);
    e.target.parentNode.classList.add('fall');
    e.target.parentNode.addEventListener('transitionend', () => {
      e.target.parentNode.remove();
    });
  }
}

function filterTodos(e) {
  [...ul.children].forEach((liItem) => {
    if (e.target.value === 'all') {
      liItem.style.display = 'block';
    } else if (e.target.value === 'completed') {
      liItem.children[0].style.textDecoration === 'line-through'
        ? (liItem.style.display = 'block')
        : (liItem.style.display = 'none');
    } else if (e.target.value === 'uncompleted') {
      liItem.children[0].style.textDecoration !== 'line-through'
        ? (liItem.style.display = 'block')
        : (liItem.style.display = 'none');
    }
  });
}

function saveToLocalStorage(prj) {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects.push(prj);
  localStorage.setItem('projects', JSON.stringify(projects));
}

function getProjects() {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects.forEach((p) => {
    if (p.value === '') {
      p.setAttribute('placeholder', '');
    } else {
      const projectli = `<li>
                <div class='project-name'>${p.project}</div>
                <div class='burger'>
                    <div class='line1'></div>
                    <div class='line2'></div>
                    <div class='line3'></div>
                </div>
                <div class='li-content'>
                    <div class='li-item' id='description-content'>Description: ${p.description}</div>
                    <div class='li-item' id='dueDate-content'>Due Date: ${p.dueDate}</div>
                    <div class='li-item' id='notes-content'>Notes: ${p.notes}</div>
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
      ul.innerHTML += projectli;
      expandProject();
    }
  });
}

function removeProject(index) {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects.splice(index, 1);
  localStorage.setItem('projects', JSON.stringify(projects));
}

function markProject(index) {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects[index].status = 'Completed';
  localStorage.setItem('projects', JSON.stringify(projects));
}

function checkCompletedProject() {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects.forEach((p, i) => {
    if (p.status === 'Completed') {
      li[i].children[0].style.textDecoration = 'line-through';
      li[i].children[2].remove();
    }
  });
  localStorage.setItem('projects', JSON.stringify(projects));
}

function saveTodo(projectIndex, todoObj) {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects[projectIndex].todos.push(todoObj);
  const todoLi = `<li>
    <div class='todo-name'>${todoObj.todo}</div>
        <button class='mark-todo-as-completed'>Completed</button>
        <button class='remove-todo'>Remove</button>
    </li>`;
  li[projectIndex].querySelector('#todo-list').innerHTML += todoLi;
  localStorage.setItem('projects', JSON.stringify(projects));
}

function getTodos() {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects.forEach((p, i) => {
    p.todos.forEach((todo) => {
      const todoLi = `<li>
            <div class='todo-name'>${todo.todo}</div>
                <button class='mark-todo-as-completed'>Completed</button>
                <button class='remove-todo'>Remove</button>
            </li>`;
      li[i].querySelector('#todo-list').innerHTML += todoLi;
    });
  });
}

function removeTodo(projectIndex, todoIndex) {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects[projectIndex].todos.splice(todoIndex, 1);
  localStorage.setItem('projects', JSON.stringify(projects));
}

function markTodo(projectIndex, todoIndex) {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects[projectIndex].todos[todoIndex].status = 'Completed';
  localStorage.setItem('projects', JSON.stringify(projects));
}

function checkCompletedTodo() {
  const projects =
    localStorage.getItem('projects') == null
      ? []
      : JSON.parse(localStorage.getItem('projects'));

  projects.forEach((p, i) => {
    p.todos.forEach((todo, j) => {
      if (todo.status === 'Completed') {
        const todoLi = li[i].querySelector('ul').children[j];
        todoLi.children[0].style.textDecoration = 'line-through';
        todoLi.children[1].remove();
      }
    });
  });
  localStorage.setItem('projects', JSON.stringify(projects));
}
