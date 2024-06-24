
let welcomeUser = document.getElementById("userName");
let userName = localStorage.getItem("fullname");

welcomeUser.innerHTML = userName;
document.addEventListener('DOMContentLoaded', (event) => {
    const wrapper = document.querySelector('.wrapper');
    const backBtn = document.querySelector('.back-btn');
    const categoriesContainer = document.querySelector('.categories');

    const toggleScreen = () => {
        wrapper.classList.toggle('show-category');
    };

    backBtn.addEventListener('click', toggleScreen);

    const addTaskBtn = document.querySelector('.add-task-btn');
    const addTaskForm = document.querySelector('.add-task');
    const blackBackdrop = document.querySelector('.black-backdrop');

    const toggleAddTaskForm = () => {
        addTaskForm.classList.toggle('active');
        blackBackdrop.classList.toggle('active');
        addTaskBtn.classList.toggle('active');
    };

    addTaskBtn.addEventListener('click', toggleAddTaskForm);
    blackBackdrop.addEventListener('click', toggleAddTaskForm);

    let categories = [];
    let tasks = [];
    let selectedCategory = null;

    const categoryTitle = document.querySelector('.category-title');
    const totalCategoryTasks = document.querySelector('.category-tasks');
    const categoryImg = document.querySelector('#category-img');
    const totaltasks = document.querySelector('.totalTasks');

    const calculateTotal = () => {
        if (!selectedCategory) return;
        const normalizedSelectedCategory = selectedCategory.title.toLowerCase();
        const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === normalizedSelectedCategory);
        const incompleteTasksCount = categoryTasks.filter((task) => !task.completed).length;
        totalCategoryTasks.innerHTML = `${incompleteTasksCount} Tasks`;
        totaltasks.innerHTML = `${tasks.length}`;
    };

    const renderCategories = () => {
        categoriesContainer.innerHTML = '';
        categories.forEach((category, index) => {
            const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === category.title.toLowerCase());
            const incompleteTasksCount = categoryTasks.filter((task) => !task.completed).length;
            const div = document.createElement('div');
            div.className = 'category';
            div.draggable = true;
            div.dataset.index = index;
            div.innerHTML = `
                <div class="left">
                    <img src="img/${category.img}" alt="${category.title}">
                    <div class="content">
                        <h1>${category.title}</h1>
                        <p>${incompleteTasksCount} Tasks</p>
                    </div>
                </div>
                <div class="options">
                    <div class="toggle-btn">
                        <i class="bx bx-dots-vertical-rounded"></i>
                    </div>
                </div>
            `;

            div.addEventListener('click', () => selectCategory(category));

            // Add drag and drop event listeners
            div.addEventListener('dragstart', handleDragStart);
            div.addEventListener('dragover', handleDragOver);
            div.addEventListener('drop', handleDrop);
            div.addEventListener('dragend', handleDragEnd);

            categoriesContainer.appendChild(div);
        });
    };

    const selectCategory = (category) => {
        wrapper.classList.add('show-category');
        selectedCategory = category;
        categoryTitle.innerHTML = category.title;
        categoryImg.src = `img/${category.img}`;
        calculateTotal();
        renderTasks();
    };

    const tasksContainer = document.querySelector('.tasks');

    const renderTasks = () => {
        if (!selectedCategory) return;
        const normalizedSelectedCategory = selectedCategory.title.toLowerCase();
        const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === normalizedSelectedCategory);

        // Sort tasks by priority
        categoryTasks.sort((a, b) => a.priority - b.priority);

        tasksContainer.innerHTML = categoryTasks.length === 0 ? `<p class="no-task">No tasks for this category</p>` : categoryTasks.map((task) => createTaskHtml(task)).join('');

        addTaskEventListeners();

        renderCategories();
        calculateTotal();
    };

    const createTaskHtml = (task) => {
        const taskDate = task.end_date ? new Date(task.end_date).toLocaleDateString() : 'No end date';
        return `
        <div class="task-wrapper">
            <label class="task" for="${task.id}">
                <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
                <span class="checkmark"><i class="bx bx-check"></i></span>
                <p>${task.task}</p>
                <p>End Date: ${taskDate}</p>
            </label>
            <div class="delete"><i class="bx bxs-trash"></i></div>
        </div>
        `;
    };

    const addTaskEventListeners = () => {
        document.querySelectorAll('.task-wrapper').forEach((taskWrapper, index) => {
            const checkbox = taskWrapper.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTaskCompleted(index));

            const deleteBtn = taskWrapper.querySelector('.delete');
            deleteBtn.addEventListener('click', () => deleteTask(index, taskWrapper));
        });
    };

    const toggleTaskCompleted = (index) => {
        tasks[index].completed = !tasks[index].completed;
        if (tasks[index].completed) {
            calculateTotal(); // Update task count if task is marked as completed
        }
        saveLocal();
    };

    const deleteTask = (index, taskWrapper) => {
        if (tasks[index].completed) {
            calculateTotal(); // Update task count if task is marked as completed
        }
        tasks.splice(index, 1);
        taskWrapper.remove();
        saveLocal();
    };

    const saveLocal = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const getLocal = () => {
        const localTasks = JSON.parse(localStorage.getItem('tasks'));

        if (localTasks) {
            tasks = localTasks;
        }
    };

    const categorySelect = document.querySelector('#category-select');
    const cancelBtn = document.querySelector('.cancel-btn');
    const addBtn = document.querySelector('.add-btn');

    const taskInput = document.querySelector('#task-input');
    const endDateInput = document.querySelector('#end-date');

    cancelBtn.addEventListener('click', toggleAddTaskForm);

    addBtn.addEventListener('click', () => {
        const task = taskInput.value.trim();
        const category = categorySelect.value;
        const endDate = endDateInput.value.trim();

        if (!task || !endDate) {
            togglePopup();
            return;
        }

        const newTaskId = Date.now();

        const newTask = {
            id: newTaskId,
            task,
            category,
            completed: false,
            end_date: endDate
        };

        tasks.push(newTask);
        taskInput.value = '';
        endDateInput.value = '';
        saveLocal();
        toggleAddTaskForm();
        renderTasks();
    });

    function togglePopup() {
        const modal = document.getElementById('popup-modal');
        modal.style.display = 'block';
    }

    // Close the modal when the user clicks on the close button
    document.querySelector('.close').addEventListener('click', () => {
        const modal = document.getElementById('popup-modal');
        modal.style.display = 'none';
    });

    // Close the modal when the user clicks anywhere outside of it
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('popup-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    fetch('data.json') 
        .then((response) => response.json())
        .then((data) => {
            categories = data.categories;
            tasks = data.tasks;
            selectedCategory = categories[0];
            renderCategories();
            renderTasks();
            calculateTotal();
            categories.forEach((category) => {
                const option = document.createElement('option');
                option.value = category.title.toLowerCase();
                option.textContent = category.title;
                categorySelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });

    getLocal();

    // Drag and Drop Functions
    let dragSrcEl = null;

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        this.classList.add('dragElem');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }

        if (dragSrcEl !== this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');

            // Swap elements in the categories array
            const dragIndex = dragSrcEl.dataset.index;
            const dropIndex = this.dataset.index;
            [categories[dragIndex], categories[dropIndex]] = [categories[dropIndex], categories[dragIndex]];
            renderCategories();
        }

        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragElem');
        document.querySelectorAll('.category').forEach((category) => {
            category.classList.remove('over');
        });
    }
});
