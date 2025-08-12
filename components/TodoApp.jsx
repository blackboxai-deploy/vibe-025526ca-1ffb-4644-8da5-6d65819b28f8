"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const STORAGE_KEY = "next_todo_items_v1";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTodos(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {}
  }, [todos]);

  const remaining = useMemo(() => todos.filter(t => !t.completed).length, [todos]);

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter(t => !t.completed);
    if (filter === "completed") return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  function addTodo(e) {
    e?.preventDefault?.();
    const value = text.trim();
    if (!value) return;
    setTodos(prev => [{ id: uid(), title: value, completed: false }, ...prev]);
    setText("");
    inputRef.current?.focus();
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function removeTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  function startEdit(id) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, editing: true } : t)));
  }

  function commitEdit(id, title) {
    const v = title.trim();
    if (!v) return removeTodo(id);
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, title: v, editing: false } : t)));
  }

  function cancelEdit(id) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, editing: false } : t)));
  }

  return (
    <div className="card">
      <form className="inputRow" onSubmit={addTodo}>
        <input
          ref={inputRef}
          className="input"
          placeholder="Add a new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="New todo"
        />
        <button className="button" type="submit" disabled={!text.trim()}>Add</button>
      </form>

      <ul className="list">
        {filtered.map((t) => (
          <li className="item" key={t.id}>
            <input
              className="checkbox"
              type="checkbox"
              checked={!!t.completed}
              onChange={() => toggleTodo(t.id)}
              aria-label={t.completed ? "Mark as active" : "Mark as completed"}
            />

            <div className="label">
              {t.editing ? (
                <EditField
                  initial={t.title}
                  onCancel={() => cancelEdit(t.id)}
                  onCommit={(v) => commitEdit(t.id, v)}
                />
              ) : (
                <p className={`title ${t.completed ? "completed" : ""}`}>{t.title}</p>
              )}
            </div>

            <div className="actions">
              {!t.editing && (
                <button className="smallBtn" onClick={() => startEdit(t.id)} aria-label="Edit">
                  Edit
                </button>
              )}
              <button className="smallBtn delete" onClick={() => removeTodo(t.id)} aria-label="Delete">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="filterRow">
        <button className={`chip ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All
        </button>
        <button className={`chip ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>
          Active
        </button>
        <button className={`chip ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>
          Completed
        </button>
        <button className="chip" onClick={clearCompleted}>
          Clear Completed
        </button>
      </div>

      <div className="stats">{remaining} item{remaining === 1 ? "" : "s"} left</div>
    </div>
  );
}

function EditField({ initial, onCommit, onCancel }) {
  const [val, setVal] = useState(initial);
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function handleKey(e) {
    if (e.key === "Enter") onCommit(val);
    if (e.key === "Escape") onCancel();
  }

  return (
    <input
      ref={ref}
      className="input"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => onCommit(val)}
      onKeyDown={handleKey}
      aria-label="Edit todo"
    />
  );
}
