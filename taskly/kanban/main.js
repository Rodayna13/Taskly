document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(kanbanData => {
      const kanbanContainer = document.getElementById('kanban-container');
      const boardLinks = document.querySelectorAll('.boards ul li');

      // Function to display a specific board
      function displayBoard(boardName) {
        // Clear existing boards
        kanbanContainer.innerHTML = '';

        // Find the selected board from fetched data
        const selectedBoard = kanbanData.boards.find(board => board.name === boardName);
        if (!selectedBoard) {
          console.error(`Board '${boardName}' not found in data.`);
          const errorMessage = document.createElement('p');
          errorMessage.textContent = `Board '${boardName}' not found.`;
          kanbanContainer.appendChild(errorMessage);
          return;
        }

        // Create elements for the selected board
        const boardElement = document.createElement('div');
        boardElement.className = 'board';

        selectedBoard.columns.forEach(column => {
          const columnElement = document.createElement('div');
          columnElement.className = 'column';
          columnElement.setAttribute('data-column', column.name);
          const columnTitle = document.createElement('h3');
          columnTitle.textContent = column.name;
          columnElement.appendChild(columnTitle);

          column.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task relative rounded-md bg-white px-4 py-6 shadow-task dark:bg-neutral-700';
            taskElement.setAttribute('draggable', true);
            taskElement.setAttribute('data-task', task.title);

            const taskTitle = document.createElement('h3');
            taskTitle.className = 'text-heading-md text-neutral-900 hover:text-purple-500 dark:text-white';
            const taskLink = document.createElement('a');
            taskLink.href = '#'; // Update this to the correct URL if available
            taskLink.textContent = task.title;
            taskLink.className = 'before:absolute before:inset-0';
            taskTitle.appendChild(taskLink);
            taskElement.appendChild(taskTitle);

            const subtasks = task.subtasks || [];
            const completedSubtasks = subtasks.filter(subtask => subtask.isCompleted).length;
            const subtasksInfo = document.createElement('p');
            subtasksInfo.className = 'mt-2 text-body-md text-neutral-400';
            subtasksInfo.textContent = `${completedSubtasks} of ${subtasks.length} subtasks`;
            taskElement.appendChild(subtasksInfo);

            // Create a list for subtasks
            if (subtasks.length > 0) {
              const subtasksList = document.createElement('ul');
              subtasksList.className = 'subtasks-list';

              subtasks.forEach(subtask => {
                const subtaskItem = document.createElement('li');
                subtaskItem.textContent = subtask.title;
                subtaskItem.className = subtask.isCompleted ? 'completed' : '';
                subtasksList.appendChild(subtaskItem);
              });

              taskElement.appendChild(subtasksList);
            }

            columnElement.appendChild(taskElement);

            // Drag and drop event listeners
            taskElement.addEventListener('dragstart', dragStart);
            taskElement.addEventListener('dragend', dragEnd);
          });

          boardElement.appendChild(columnElement);

          // Column drag and drop event listeners
          columnElement.addEventListener('dragover', dragOver);
          columnElement.addEventListener('dragenter', dragEnter);
          columnElement.addEventListener('dragleave', dragLeave);
          columnElement.addEventListener('drop', drop);
        });

        // Append the board to the kanban container
        kanbanContainer.appendChild(boardElement);
      }

      // Function to set the active board
      function setActiveBoard(boardName) {
        boardLinks.forEach(link => {
          if (link.getAttribute('data-board') === boardName) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        displayBoard(boardName);
      }

      // Initial display of the first board in the list
      setActiveBoard('Platform Launch');

      // Event listeners for board selection in sidebar
      boardLinks.forEach(boardLink => {
        boardLink.addEventListener('click', () => {
          const boardName = boardLink.getAttribute('data-board');
          setActiveBoard(boardName);
        });
      });

    })
  
    .catch(error => console.error('Error fetching JSON:', error));

 



    const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
  
    // Apply saved theme on load
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
  
  
  let draggedTask = null;
  
  function dragStart() {
    draggedTask = this;
    setTimeout(() => this.classList.add('hidden'), 0);
  }

  function dragStart() {
    draggedTask = this;
    setTimeout(() => this.classList.add('hidden'), 0);
  }
  
  
  function dragOver(e) {
    e.preventDefault();
  }
  
function dragEnd() {
  this.classList.remove('hidden');
  draggedTask = null;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add('hovered');
}

function dragLeave() {
  this.classList.remove('hovered');
}

function drop() {
  this.classList.remove('hovered');
  if (this.classList.contains('column')) {
    this.appendChild(draggedTask);
  }
}
  document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('#sidebar-toggle');
    const themeToggle = document.querySelector('#theme-toggle');
    
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('visible');
    });
    
   
  });
