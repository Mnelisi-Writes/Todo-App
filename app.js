let tasks = [];

const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });

        updateTasksList();
        taskInput.value = ""; // Clear input after adding task
        updateStats();
    }
    
};
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
}
const deleteTask = (index) =>{
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
};
const editTask = (index) =>{
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
      tasks[index].text = newText.trim();
      updateTasksList(); // Re-render task list
    }
};

const updateStats = () =>{
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progress = (completedTasks / totalTasks) *100;
    const progressBar = document.getElementById('progress');

    progressBar.style.width = `${progress}%`;

    document.getElementById('numbers').innerText = `${completedTasks} / ${totalTasks}`
}

const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
        <div class="taskItem">
             <div class="task ${task.completed ? "completed" : ""}">
               <input type="checkbox" class="checkbox" 
               ${task.completed ? "checked" : ""}
               onchange="toggleTaskComplete(${index})"/>
               <p>${task.text}</p>
             </div>
             <div class="icons">
               <i class="fa-solid fa-pen-to-square" onClick="editTask(${index})"></i>
               <i class="fa-solid fa-trash" style="color:red" onClick="deleteTask(${index})"></i>
             </div>
        </div>     
        `;

        taskList.append(listItem);
    });
};



document.getElementById("newTask").addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});
