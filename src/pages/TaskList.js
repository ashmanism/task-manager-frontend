import { useState } from "react";

function TaskList({ tasks, deleteTask, toggleTask, handleEdit }) {
  const [filter, setFilter] = useState("All");

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Task List</h2>

      {/* Filters */}
      <div style={styles.filters}>
        <button
          style={filter === "All" ? styles.activeFilter : styles.filter}
          onClick={() => setFilter("All")}
        >
          All
        </button>

        <button
          style={filter === "Pending" ? styles.activeFilter : styles.filter}
          onClick={() => setFilter("Pending")}
        >
          Pending
        </button>

        <button
          style={filter === "Completed" ? styles.activeFilter : styles.filter}
          onClick={() => setFilter("Completed")}
        >
          Completed
        </button>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <p style={styles.empty}>No tasks found</p>
      )}

      {/* Task Cards */}
      {filteredTasks.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.card,
            borderLeft: isOverdue(t.deadline)
              ? "5px solid red"
              : "5px solid #3b82f6"
          }}
        >
          {/* Left Content */}
          <div style={styles.content}>
            <h3 style={styles.title}>{t.title}</h3>

            <p style={styles.description}>{t.description}</p>

            <p style={styles.meta}>
              📅{" "}
              {t.deadline
                ? new Date(t.deadline).toLocaleString()
                : "No deadline"}
            </p>

            <p style={styles.meta}>
              🔔 {t.reminder} min before
            </p>

            <span
              style={{
                ...styles.status,
                background:
                  t.status === "Completed" ? "#16a34a" : "#f59e0b"
              }}
            >
              {t.status}
            </span>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button onClick={() => toggleTask(t.id)}>✔</button>
            <button onClick={() => handleEdit(t)}>✏️</button>
            <button onClick={() => deleteTask(t.id)}>❌</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;

const styles = {
  container: {
    padding: "20px"
  },
  heading: {
    marginBottom: "15px"
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },
  filter: {
    padding: "6px 12px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  activeFilter: {
    padding: "6px 12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "5px"
  },
  empty: {
    color: "#777"
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    marginBottom: "10px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  content: {
    maxWidth: "70%"
  },
  title: {
    margin: 0
  },
  description: {
    color: "#555",
    margin: "5px 0"
  },
  meta: {
    fontSize: "12px",
    color: "#777"
  },
  status: {
    display: "inline-block",
    marginTop: "5px",
    padding: "3px 8px",
    borderRadius: "5px",
    color: "white",
    fontSize: "12px"
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  }
};