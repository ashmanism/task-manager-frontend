import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/MyNavbar";
import AddTask from "./pages/AddTask";
import TaskList from "./pages/TaskList";
import Overview from "./pages/Overview";
import Login from "./Login";

function App() {
  const [page, setPage] = useState("list");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🧠 Shared state
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [reminder, setReminder] = useState(5);
  const [editId, setEditId] = useState(null);
  const [notifications, setNotifications] = useState([]);

  console.log("Sidebar:", Sidebar);
  console.log("Navbar:", Navbar);
  console.log("AddTask:", AddTask);
  console.log("TaskList:", TaskList);
  console.log("Overview:", Overview);
  console.log("Login:", Login);

  // 🔒 Check login on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
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

  // ⏰ Reminder system
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
            setNotifications((prev) => [
              ...prev,
              `${task.title} is due soon`
            ]);
            return { ...task, notified: true };
          }

          return task;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // 🔐 Auth
  const handleLogin = () => {
    localStorage.setItem("token", "dummy-token");
    setIsLoggedIn(true);
    setPage("list");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setPage("list");
  };

  // ➕ Add / ✏️ Edit
  const addTask = () => {
    if (!title) return;

    if (editId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editId
            ? { ...t, title, description, deadline, reminder }
            : t
        )
      );
      setEditId(null);
      setPage("list");
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

      setTasks((prev) => [...prev, newTask]);
      setPage("list");
    }

    setTitle("");
    setDescription("");
    setDeadline("");
    setReminder(5);
  };

  // ❌ Delete
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ✔ Toggle status
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "Pending" ? "Completed" : "Pending"
            }
          : t
      )
    );
  };

  // ✏️ Edit
  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(task.deadline);
    setReminder(task.reminder);
    setEditId(task.id);
    setPage("add");
  };

  // 🔐 Show login if not authenticated
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // ✅ Main dashboard
  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />

      <div style={{ flex: 1 }}>
        <Navbar
          logout={logout}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {page === "add" && (
          <AddTask
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            deadline={deadline}
            setDeadline={setDeadline}
            reminder={reminder}
            setReminder={setReminder}
            addTask={addTask}
            editId={editId}
            setEditId={setEditId}
          />
        )}

        {page === "list" && (
          <TaskList
            tasks={tasks}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            handleEdit={handleEdit}
          />
        )}

        {page === "overview" && (
          <Overview tasks={tasks} />
        )}
      </div>
    </div>
  );
}

export default App;