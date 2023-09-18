document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("f1");
    const tasksContainer = document.getElementById("tasks");
    const sortByDueDateButton = document.getElementById("sort-by-due-date");
    const sortByPriorityButton = document.getElementById("sort-by-priority");
    const sortByCompletionButton = document.getElementById("sort-by-completion");
    const sortByCategoryButton = document.getElementById("sort-by-category");
    const searchInput = document.getElementById("search-input");
    const filterCategorySelect = document.getElementById("filter-category");
    const filterButton = document.getElementById("filter-button");
    const dateInput = document.getElementById("date");

    let tasks = [];


    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const taskInput = document.getElementById("inf");
        const dateInput = document.getElementById("date");
        const categorySelect = document.getElementById("category");
        const priorityInput = document.getElementById("priority");
        const labelsInput = document.getElementById("labels");

        const task = {
            name: taskInput.value,
            date: dateInput.value,
            category: categorySelect.value,
            priority: priorityInput.value,
            labels: labelsInput.value.split(",").map(label => label.trim()),
            completed: false,
        };

        tasks.push(task);
        updateTasks();
        form.reset();

    
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });


    dateInput.addEventListener("input", function () {
        const selectedDate = new Date(dateInput.value);
        const currentDate = new Date();
        
        if (selectedDate < currentDate) {
           
            alert("Please select a future date.");
            dateInput.value = ""; 
        }
    });

    


    function openEditForm(index) {
        const taskToEdit = tasks[index];
        const editForm = document.createElement("div");
        editForm.innerHTML = `
            <h2>Edit Task</h2>
            <form id="edit-form">
                <input type="text" id="edit-name" value="${taskToEdit.name}" required>
                <input type="text" id="edit-date" value="${taskToEdit.date}" required>
                <select id="edit-category">
                    <option value="work" ${taskToEdit.category === "work" ? "selected" : ""}>Work</option>
                    <option value="personal" ${taskToEdit.category === "personal" ? "selected" : ""}>Personal</option>
                    <option value="other" ${taskToEdit.category === "other" ? "selected" : ""}>Other</option>
                </select>
                <input type="number" id="edit-priority" value="${taskToEdit.priority}" required>
                <input type="text" id="edit-labels" value="${taskToEdit.labels ? taskToEdit.labels.join(", ") : ""}">
                <button type="submit" id="save-btn">Save</button>
                <button type="button" id="cancel-edit">Cancel</button>
            </form>
        `;
    
       
        tasksContainer.appendChild(editForm);

        const editFormElement = document.getElementById("edit-form");
        const editNameInput = document.getElementById("edit-name");
        const editDateInput = document.getElementById("edit-date");
        const editCategorySelect = document.getElementById("edit-category");
        const editPriorityInput = document.getElementById("edit-priority");
        const editLabelsInput = document.getElementById("edit-labels");
        const cancelEditButton = document.getElementById("cancel-edit");

        editFormElement.addEventListener("submit", function (e) {
            e.preventDefault();

          
            tasks[index].name = editNameInput.value;
            tasks[index].date = editDateInput.value;
            tasks[index].category = editCategorySelect.value;
            tasks[index].priority = editPriorityInput.value;
            tasks[index].labels = editLabelsInput.value.split(",").map(label => label.trim());

           
            updateTasks();

          
            editFormElement.remove();

       
            localStorage.setItem("tasks", JSON.stringify(tasks));
        });

        cancelEditButton.addEventListener("click", function () {
            
            editFormElement.remove();
        });
    }


    function updateTasks(taskList) {
        tasksContainer.innerHTML = "";
       (taskList || tasks).forEach((task, index) => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            if (task.completed) {
                taskDiv.classList.add("completed");
            }

            taskDiv.innerHTML = `
                <div class="content">
                    <h3>${task.name}</h3>
                    <p>DeadLine: ${task.date}</p>
                    <p>Category: ${task.category}</p>
                    <p>Priority: ${task.priority}</p>
                    <p>Labels: ${task.labels ? task.labels.join(", ") : ""}</p>
                </div>
                <button class="complete-button" data-index="${index}">
                    ${task.completed ? "Undo" : "Complete"}
                </button>
                <button class="edit-button" data-index="${index}">Edit</button>
                <button class="delete-button" data-index="${index}">Delete</button>
            `;

            taskDiv.querySelector(".complete-button").addEventListener("click", function () {
                tasks[index].completed = !tasks[index].completed;
                updateTasks();

              
                localStorage.setItem("tasks", JSON.stringify(tasks));
            });

            taskDiv.querySelector(".edit-button").addEventListener("click", function () {
              
                openEditForm(index);
            });

            taskDiv.querySelector(".delete-button").addEventListener("click", function () {
                tasks.splice(index, 1);
                updateTasks();

                
                localStorage.setItem("tasks", JSON.stringify(tasks));
            });

            tasksContainer.appendChild(taskDiv);
        });
    }

    sortByDueDateButton.addEventListener("click", function () {
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        updateTasks();
    });

    sortByPriorityButton.addEventListener("click", function () {
        tasks.sort((a, b) => b.priority - a.priority);
        updateTasks();
    });

    sortByCompletionButton.addEventListener("click", function () {
        tasks.sort((a, b) => b.completed - a.completed);
        updateTasks();
    });

    sortByCategoryButton.addEventListener("click", function () {
        tasks.sort((a, b) => b.category.localeCompare(a.category));
        updateTasks();
    });

    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task =>
            task.name.toLowerCase().includes(searchText) ||
            task.category.toLowerCase().includes(searchText) ||
            (task.labels && task.labels.some(label => label.toLowerCase().includes(searchText))) // Check if labels are defined
        );
        updateTasks(filteredTasks); 
    });
    

    filterButton.addEventListener("click", function () {
        const selectedCategory = filterCategorySelect.value;
        if (selectedCategory === "all") {
            updateTasks(tasks); 
        } else {
            const filteredTasks = tasks.filter(task => task.category === selectedCategory);
            updateTasks(filteredTasks); 
        }
    });
    
    updateTasks();


    function updateClock() {
        const clockDisplay = document.getElementById("clockDisplay");
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const timeString = `${hours}:${minutes}:${seconds}`;
        clockDisplay.textContent = timeString;
    }

   
    setInterval(updateClock, 1000);

 
    updateClock();
});
