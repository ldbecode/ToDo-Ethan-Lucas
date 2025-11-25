let tasks = [];
const ASSIGNEES = {
    nerd: "🤓",
    alien: "👽",
    clown: "🤡"
};
const TASK_LISTS = ['ToDo', 'Doing', 'Done'];

function getListIdSuffix(status) {
    return status.replace(/\s/g, '');
}

function saveTasks() {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('kanban-tasks');
    if (storedTasks) {
        try {
            tasks = JSON.parse(storedTasks).map(task => ({
                ...task,
                title: task.title || task.text,
                description: task.description || '' 
            }));
        } catch (e) {
            localStorage.removeItem('kanban-tasks');
            tasks = [];
        }
    }
}

function addTask() {
    const titleInput = document.getElementById('taskTitleInput');
    const descInput = document.getElementById('taskDescInput');
    const taskTitle = titleInput.value.trim();
    const taskDesc = descInput.value.trim();
    const selectedAssignee = document.querySelector('.assignee.selected');

    if (taskTitle === '' || !selectedAssignee) {
        return;
    }

    tasks.push({
        title: taskTitle,
        description: taskDesc,
        completed: false,
        id: Date.now(),
        status: 'To Do',
        assignee: selectedAssignee.dataset.assignee
    });

    renderTasks();
    saveTasks();
    titleInput.value = '';
    descInput.value = '';
    selectedAssignee.classList.remove('selected');
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
    saveTasks();
}

function updateTaskStatus(taskId, newStatus) {
    const taskToUpdate = tasks.find(task => task.id == taskId);
    if (taskToUpdate) {
        taskToUpdate.status = newStatus;
        taskToUpdate.completed = (newStatus === 'Done');
        renderTasks();
        saveTasks();
    }
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
    e.target.classList.add('is-dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('is-dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e, targetStatus) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    updateTaskStatus(taskId, targetStatus);
}

function renderTasks() {
    TASK_LISTS.forEach(status => {
        const idSuffix = getListIdSuffix(status);
        const listElement = document.getElementById(`taskList${idSuffix}`);
        if (listElement) listElement.innerHTML = '';
    });

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task ${task.completed ? 'completed' : ''}`;
        li.setAttribute('draggable', true);
        li.dataset.taskId = task.id;

        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragend', handleDragEnd);

        const assigneeEmoji = ASSIGNEES[task.assignee] || '❓';

        li.innerHTML = `
          <div class="button">
            <h1 class="task-title">${task.title} (${assigneeEmoji})</h1>
            <p>${task.description || 'No description provided'}</p>
            <div class="members">
              <span style="font-size: 20px;">${assigneeEmoji}</span>
            </div>
            <button class="deleteBtn">Delete</button>
          </div>
        `;

        li.querySelector('.deleteBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            deleteTask(task.id);
        });

        const targetList = document.getElementById(`taskList${getListIdSuffix(task.status)}`);
        if (targetList) targetList.appendChild(li);
    });
}

function setupAssigneeSelection() {
    const assigneesContainer = document.getElementById('assignees');
    if (!assigneesContainer) return;

    Object.entries(ASSIGNEES).forEach(([key, emoji]) => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.className = 'assignee';
        span.dataset.assignee = key;

        span.addEventListener('click', () => {
            document.querySelectorAll('.assignee').forEach(s => s.classList.remove('selected'));
            span.classList.add('selected');
        });

        assigneesContainer.appendChild(span);
    });
}

function setupDropZones() {
    TASK_LISTS.forEach(status => {
        const idSuffix = getListIdSuffix(status);
        const listElement = document.getElementById(`taskList${idSuffix}`);
        if (listElement) {
            listElement.addEventListener('dragover', handleDragOver);
            listElement.addEventListener('drop', e => handleDrop(e, status));
        }
    });
}

loadTasks();
setupAssigneeSelection();
setupDropZones();
renderTasks();

document.getElementById('addButton').addEventListener('click', addTask);

document.getElementById('taskTitleInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});
