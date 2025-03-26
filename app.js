import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "./firebaseConfig.js";

let tasks = [];

const addTask = async () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        try {
            const taskRef = await addDoc(collection(db, "tasks"), {
                text: text,
                completed: false,
            });

            tasks.push({ id: taskRef.id, text: text, completed: false });

            updateTasksList();
            taskInput.value = ""; // Clear input after adding task
            updateStats();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }
};
const toggleTaskComplete = async (index) => {
    const task = tasks[index];
    task.completed = !task.completed;

    try {
        await updateDoc(doc(db, "tasks", task.id), { completed: task.completed });
        updateTasksList();
        updateStats();
    } catch (error) {
        console.error("Error updating task:", error);
    }
};
const deleteTask = async (index) => {
    const task = tasks[index];

    try {
        await deleteDoc(doc(db, "tasks", task.id));
        tasks.splice(index, 1);
        updateTasksList();
        updateStats();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};
const editTask = async (index) => {
    const newText = prompt("Edit task:", tasks[index].text);
    
    if (newText !== null && newText.trim() !== "") {
        const task = tasks[index];
        task.text = newText.trim();

        try {
            await updateDoc(doc(db, "tasks", task.id), { text: task.text });
            updateTasksList(); // Re-render task list
        } catch (error) {
            console.error("Error updating task text:", error);
        }
    }
};const loadTasks = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        tasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        updateTasksList();
        updateStats();
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
};

// Load tasks when the page loads
window.onload = loadTasks;

