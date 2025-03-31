// Import Firebase modules (add this to your HTML or module setup)
// Make sure to include these scripts in your HTML:
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js"></script>

const firebaseConfig = {
  apiKey: "AIzaSyDaONss8a3-oO_TNQX-5YPzD12E4d1bWlI",
  authDomain: "mnelisi-todolist.firebaseapp.com",
  projectId: "mnelisi-todolist",
  storageBucket: "mnelisi-todolist.firebasestorage.app",
  messagingSenderId: "334133636005",
  appId: "1:334133636005:web:a5726c606d94c6f528164c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let tasks = [];

// Function to fetch tasks from Firestore
const fetchTasks = async () => {
  try {
      const snapshot = await db.collection("tasks").orderBy("dueDate").get();
      tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      }));
      updateTasksList();
      updateStats();
  } catch (error) {
      console.error("Error fetching tasks: ", error);
  }
};

// Function to add a task to Firestore
const addTask = async () => {
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const text = taskInput.value.trim();
  const dueDate = taskDate.value;

  if (text && dueDate) {
      try {
          const docRef = await db.collection("tasks").add({
              text: text,
              dueDate: dueDate,
              completed: false,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          
          // Add to local array with the generated ID
          tasks.push({ 
              id: docRef.id, 
              text: text, 
              dueDate: dueDate,
              completed: false 
          });
          
          updateTasksList();
          taskInput.value = "";
          taskDate.value = "";
          updateStats();
      } catch (error) {
          console.error("Error adding task: ", error);
      }
  } else {
      alert("Please fill in both task description and due date");
  }
};

// Function to toggle task completion status
const toggleTaskComplete = async (index) => {
  const task = tasks[index];
  try {
      await db.collection("tasks").doc(task.id).update({
          completed: !task.completed
      });
      tasks[index].completed = !task.completed;
      updateTasksList();
      updateStats();
  } catch (error) {
      console.error("Error updating task: ", error);
  }
};

// Function to delete a task
const deleteTask = async (index) => {
  const task = tasks[index];
  try {
      await db.collection("tasks").doc(task.id).delete();
      tasks.splice(index, 1);
      updateTasksList();
      updateStats();
  } catch (error) {
      console.error("Error deleting task: ", error);
  }
};

// Function to edit a task
const editTask = async (index) => {
  const task = tasks[index];
  const newText = prompt("Edit task:", task.text);
  
  if (newText !== null && newText.trim() !== "") {
      try {
          await db.collection("tasks").doc(task.id).update({
              text: newText.trim()
          });
          tasks[index].text = newText.trim();
          updateTasksList();
      } catch (error) {
          console.error("Error updating task: ", error);
      }
  }
};

// Function to format date for display
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const updateStats = () => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const progressBar = document.getElementById('progress');

  progressBar.style.width = `${progress}%`;
  document.getElementById('numbers').innerText = `${completedTasks} / ${totalTasks}`;
};

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
                  <div class="task-content">
                      <p>${task.text}</p>
                      <small class="due-date">Due: ${formatDate(task.dueDate)}</small>
                  </div>
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

// Initialize the app by fetching tasks when the page loads
document.addEventListener("DOMContentLoaded", fetchTasks);

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();
  addTask();
});