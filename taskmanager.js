document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('task-input')
    const addTaskBtn = document.getElementById('add-task')
    const taskList = document.getElementById('task-list')
    const emptyMessage = document.getElementById('empty-message')
    const filterBtns = document.querySelectorAll('.filter-btn')
  
    let tasks = []
    let currentFilter = 'all'
  
    // Load tasks from local storage
    if (localStorage.getItem('tasks')) {
      tasks = JSON.parse(localStorage.getItem('tasks'))
      renderTasks()
    }
  
    // Add new task
    addTaskBtn.addEventListener('click', function () {
      addTask()
    })
  
    taskInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addTask()
      }
    })
  
    // Filter tasks
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        filterBtns.forEach((b) => b.classList.remove('active'))
        this.classList.add('active')
        currentFilter = this.dataset.filter
        renderTasks()
      })
    })
  
    // Function to add a new task
    function addTask() {
      const taskText = taskInput.value.trim()
      if (taskText) {
        const newTask = {
          id: Date.now(),
          text: taskText,
          completed: false,
        }
  
        tasks.push(newTask)
        saveTasks()
        renderTasks()
        taskInput.value = ''
      }
    }
  
    // Function to toggle task completion
    function toggleComplete(taskId) {
      tasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed }
        }
        return task
      })
      saveTasks()
      renderTasks()
    }
  
    // Function to delete a task
    function deleteTask(taskId) {
      tasks = tasks.filter((task) => task.id !== taskId)
      saveTasks()
      renderTasks()
    }
  
    // Function to save tasks to local storage
    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  
    // Function to render tasks based on current filter
    function renderTasks() {
      taskList.innerHTML = ''
  
      // Filter tasks based on current filter
      let filteredTasks = tasks
      if (currentFilter === 'active') {
        filteredTasks = tasks.filter((task) => !task.completed)
      } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter((task) => task.completed)
      }
  
      // Show/hide empty message
      if (filteredTasks.length === 0) {
        emptyMessage.style.display = 'block'
      } else {
        emptyMessage.style.display = 'none'
      }
  
      // Render filtered tasks
      filteredTasks.forEach((task) => {
        const taskItem = document.createElement('li')
        taskItem.className = 'task-item'
  
        const taskText = document.createElement('span')
        taskText.className = 'task-text'
        if (task.completed) {
          taskText.classList.add('completed')
        }
        taskText.textContent = task.text
  
        const taskActions = document.createElement('div')
        taskActions.className = 'task-actions'
  
        const completeBtn = document.createElement('button')
        completeBtn.className = 'complete-btn'
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete'
        completeBtn.addEventListener('click', () => toggleComplete(task.id))
  
        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'delete-btn'
        deleteBtn.textContent = 'Delete'
        deleteBtn.addEventListener('click', () => deleteTask(task.id))
  
        taskActions.appendChild(completeBtn)
        taskActions.appendChild(deleteBtn)
  
        taskItem.appendChild(taskText)
        taskItem.appendChild(taskActions)
  
        taskList.appendChild(taskItem)
      })
    }
  })