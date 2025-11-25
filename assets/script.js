let tasks = [];


function saveTasks() {
    localStorage.setItem('todo-list-tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('todo-list-tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}


function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    tasks.push({
        text: taskText,
        completed: false,
        id: Date.now()
    });

    displayTasks();
    saveTasks();
    input.value = '';
    input.focus();
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    displayTasks();
    saveTasks();
}

function toggleCompleted(taskId) {
    const taskToUpdate = tasks.find(t => t.id === taskId);

    if (taskToUpdate) {
        taskToUpdate.completed = !taskToUpdate.completed;
        displayTasks();
        saveTasks();
    }
}


function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task ${task.completed ? 'completed' : ''}`;

  
        li.innerHTML = `
          <div class="button">
            <h1 class="task-title">${task.text}</h1> 
            <p>Cliquez pour marquer complété</p>
            <div class="members">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" class="social-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" class="social-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" class="social-icon">
            </div>
            <button class="deleteBtn">Delete</button>
          </div>
        `;

        const deleteBtn = li.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); 
            deleteTask(task.id);
        });

 
        li.addEventListener('click', function() {
            toggleCompleted(task.id);
        });

        taskList.appendChild(li);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');

    loadTasks();
    displayTasks();

    addButton.addEventListener('click', addTask);

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});