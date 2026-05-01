import { useState, useEffect } from "react";

function Dashboard() {
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [reminder, setReminder] = useState(5);

  // 🔒 Protect dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/";
  }, []);

  // 📦 Load tasks
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // 💾 Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ⏰ Reminder logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setTasks((prev) =>
        prev.map((task) => {
          if (!task.deadline || task.notified) return task;

          const taskTime = new Date(task.deadline);
          const reminderTime = new Date(
            taskTime.getTime() - task.reminder * 60000
          );

          if (now >= reminderTime && now < taskTime) {
            alert(`Reminder: ${task.title} is due soon!`);
            return { ...task, notified: true };
          }

          return task;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  const addTask = () => {
    if (!title) return;

    if (editId) {
      setTasks(
        tasks.map((t) =>
          t.id === editId
            ? { ...t, title, description, deadline, reminder }
            : t
        )
      );
      setEditId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title,
        description,
        deadline,
        reminder,
        status: "Pending",
        notified: false
      };
      setTasks([...tasks, newTask]);
    }

    setTitle("");
    setDescription("");
    setDeadline("");
    setReminder(5);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(task.deadline);
    setReminder(task.reminder);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "Pending" ? "Completed" : "Pending"
            }
          : t
      )
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h3>Task Manager</h3>
        <div>
          <button style={styles.navButton}>🔔</button>
          <button style={styles.navButton} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
      </div>

      {/* Form */}
      <div style={styles.form}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          style={styles.input}
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={styles.input}
        />

        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={styles.input}
        />

        <select
          value={reminder}
          onChange={(e) => setReminder(Number(e.target.value))}
          style={styles.input}
        >
          <option value={5}>5 min before</option>
          <option value={10}>10 min before</option>
          <option value={15}>15 min before</option>
        </select>

        <button onClick={addTask} style={styles.button}>
          {editId ? "Update Task" : "Add Task"}
        </button>

        {editId && (
          <button onClick={() => setEditId(null)}>Cancel</button>
        )}
      </div>

      {/* Task List */}
      {filteredTasks.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.taskCard,
            borderColor: isOverdue(t.deadline) ? "red" : "#ddd"
          }}
        >
          <div>
            <h3 style={styles.title}>{t.title}</h3>
            <p style={styles.description}>{t.description}</p>

            <p style={styles.deadline}>
              📅 {t.deadline
                ? new Date(t.deadline).toLocaleString()
                : "No deadline"}
            </p>

            <p style={{ fontSize: "12px", color: "#555" }}>
              🔔 {t.reminder} min before
            </p>

            <span
              style={{
                ...styles.status,
                backgroundColor:
                  t.status === "Completed" ? "#4CAF50" : "#f39c12"
              }}
            >
              {t.status}
            </span>
          </div>

          <div style={styles.actions}>
            <button onClick={() => toggleTask(t.id)}>✔</button>
            <button onClick={() => deleteTask(t.id)}>❌</button>
            <button onClick={() => handleEdit(t)}>✏️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ccc"
  },
  navButton: { marginLeft: "10px", padding: "5px 10px" },
  filters: { marginTop: "15px", marginBottom: "15px" },
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "300px"
  },
  input: { padding: "10px", margin: "5px 0" },
  button: { padding: "10px", marginTop: "10px" },
  taskCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "8px",
    backgroundColor: "#fafafa"
  },
  title: { margin: 0 },
  description: { margin: "5px 0", color: "#555" },
  deadline: { fontSize: "12px", color: "#888" },
  status: {
    padding: "3px 8px",
    borderRadius: "5px",
    color: "white",
    fontSize: "12px"
  },
  actions: { display: "flex", gap: "10px" }
};

export default Dashboard;