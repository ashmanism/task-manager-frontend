function AddTask({
  title,
  setTitle,
  description,
  setDescription,
  deadline,
  setDeadline,
  reminder,
  setReminder,
  addTask,
  editId,
  setEditId
}) {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        {editId ? "Edit Task" : "Add New Task"}
      </h2>

      <div style={styles.form}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          style={styles.input}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={styles.textarea}
        />

        <label style={styles.label}>Deadline</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Reminder</label>
        <select
          value={reminder}
          onChange={(e) => setReminder(Number(e.target.value))}
          style={styles.input}
        >
          <option value={5}>5 min before</option>
          <option value={10}>10 min before</option>
          <option value={15}>15 min before</option>
        </select>

        <button onClick={addTask} style={styles.primaryButton}>
          {editId ? "Update Task" : "Add Task"}
        </button>

        {editId && (
          <button
            onClick={() => setEditId(null)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default AddTask;

const styles = {
  container: {
    padding: "20px"
  },
  heading: {
    marginBottom: "15px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  textarea: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "80px"
  },
  label: {
    fontSize: "12px",
    marginBottom: "5px",
    color: "#555"
  },
  primaryButton: {
    padding: "10px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  cancelButton: {
    marginTop: "10px",
    padding: "10px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};