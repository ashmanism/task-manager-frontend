import { useState } from "react";

function Dashboard() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (!task) return;

    const newTask = {
      id: Date.now(),
      title: task,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  return (
    <div style={styles.container}>
      <h2>Task Dashboard</h2>

      <div>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task..."
          style={styles.input}
        />
        <button onClick={addTask} style={styles.button}>
          Add
        </button>
      </div>

      <div>
        {tasks.map((t) => (
          <div key={t.id} style={styles.task}>
            <span
              onClick={() => toggleTask(t.id)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer"
              }}
            >
              {t.title}
            </span>

            <button onClick={() => deleteTask(t.id)}>❌</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px"
  },
  input: {
    padding: "10px",
    marginRight: "10px"
  },
  button: {
    padding: "10px"
  },
  task: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    borderBottom: "1px solid #ccc",
    padding: "5px 0"
  }
};

export default Dashboard;