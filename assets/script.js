let tasks = [];

document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');

    addButton.addEventListener('click', function() {
        addTask();
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = input.value.trim();


        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        tasks.push(taskText);
        displayTasks();
        input.value = '';
    }

function displayTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task';
    li.innerHTML = `
      <div class="button">
        <h1>Task ${index + 1}</h1>
        <p>${task}</p>
        <div class="members">
          <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" class="social-icon">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" class="social-icon">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" class="social-icon">
        </div>
        <button class="deleteBtn">Delete</button>
      </div>
    `;
    
    const deleteBtn = li.querySelector('.deleteBtn');
    deleteBtn.addEventListener('click', function() {
      deleteTask(index);
    });
    
    taskList.appendChild(li);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
}
});
            

