const admin = require("firebase-admin");
const serviceAccount = require("./config/firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;

const db = require("./firebase");

async function addTask(title, description) {
  const task = {
    title,
    description,
    completed: false,
    createdAt: new Date()
  };

  const res = await db.collection("tasks").add(task);
  console.log("Task added with ID:", res.id);
}

addTask("Learn Firebase", "Implement Firestore in my Node.js app");
async function getTasks() {
    const snapshot = await db.collection("tasks").get();
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  }
  
  getTasks();

  async function updateTask(taskInput, completed) {
    await db.collection("tasks").doc(taskInput).update({ completed });
    console.log("Task updated:", taskInput);
  }
  
  updateTask(taskInput, true);
  
  async function deleteTask(taskInput) {
    await db.collection("tasks").doc(taskInput).delete();
    console.log("Task deleted:", taskInput);
  }
  
  deleteTask(taskInput);
  