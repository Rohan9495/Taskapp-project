import { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    } else {
      return [];
    }
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: uuidv4(), title: newTaskTitle.trim(), completed: false }]);
    setNewTaskTitle('');
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
  };

  const saveEdit = () => {
    if (!editTaskTitle.trim()) return;
    setTasks(tasks.map(task => 
      task.id === editingTaskId ? { ...task, title: editTaskTitle.trim() } : task
    ));
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTaskTitle('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="app-container">
      <div className="task-manager">
        <header className="header">
          <h1>TaskBuddy</h1>
          <p className="subtitle">Stay organized, focused, and productive.</p>
        </header>

        <form onSubmit={addTask} className="add-task-form">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="task-input"
            />
            <button type="submit" className="add-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </form>

        <div className="filters">
          <button className={filter === 'all' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'active' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('active')}>Active</button>
          <button className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('completed')}>Completed</button>
        </div>

        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Take a break! ☕</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''} ${editingTaskId === task.id ? 'editing' : ''}`}>
                {editingTaskId === task.id ? (
                  <div className="edit-mode">
                    <input 
                      type="text" 
                      value={editTaskTitle}
                      onChange={(e) => setEditTaskTitle(e.target.value)}
                      className="edit-input"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="icon-btn save" aria-label="Save">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </button>
                      <button onClick={cancelEdit} className="icon-btn cancel" aria-label="Cancel">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => toggleTaskCompletion(task.id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    
                    <span className="task-title" onDoubleClick={() => startEditing(task)}>
                      {task.title}
                    </span>
                    
                    <div className="task-actions">
                      <button onClick={() => startEditing(task)} className="icon-btn edit" aria-label="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="icon-btn delete" aria-label="Delete">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
        
        <div className="footer">
          <p>{activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining</p>
        </div>
      </div>
    </div>
  );
}

export default App;
