import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialTodos = [];

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState('Low');
  const [onlineState, setOnlineState] = useState(false);

useEffect(() => {
  axios.get('http://localhost:3001/api/todos')
    .then(res => {
      setTodos(res.data);
      setOnlineState(true); 
    })
    .catch(err => {
      console.error('Failed to load todos:', err);
      setOnlineState(false);
    });
}, []);
  
  const generateId = () => Date.now();

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const date = new Date()
    const todo = {
      id: generateId(),
      date_posted: date.getDate()+ "/" + (date.getMonth() + 1) +"/"+ date.getFullYear() + " at " + date.getHours() +'H :' + date.getMinutes()+ 'M :' + date.getSeconds()+"S",
      text: newTodo,
      completed: false,
      priority: 'Low',
      starred: false,
    };
    setTodos([todo, ...todos]);
    setNewTodo('');
    if (onlineState){
      try {
      await axios.post('http://localhost:3001/api/todos', todo);
      
    } catch (err) {
      console.error('Add failed:', err);
    }}
    
  };

  const toggleCompleted = async(id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    if(onlineState){
      const todo = todos.find(t => t.id === id);
      try {
        await axios.put(`http://localhost:3001/api/todos/${id}`, { completed: !todo.completed });
      } catch (err) {
        console.error('Toggle completed failed:', err);
      }

    }
  };
 

  const deleteTodo = async (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    try {
      await axios.delete(`http://localhost:3001/api/todos/${id}`);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const toggleStar = async(id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, starred: !todo.starred } : todo));
    if(onlineState){
      const todo = todos.find(t => t.id === id);
      try {
        await axios.put(`http://localhost:3001/api/todos/${id}`, { starred: !todo.starred });
      } catch (err) {
        console.error('Toggle star failed:', err);
      }
    }
  };

  const startEditing = (id, text, priority) => {
    setEditingId(id);
    setEditingText(text);
    setEditingPriority(priority);
  };

  const updateTodo = async (id) => {
    const updatedTodo = {
      text: editingText,
      priority: editingPriority
    };
    if (onlineState) {
      try {
        await axios.put(`http://localhost:3001/api/todos/${id}`, updatedTodo);  
      } catch (err) {
        console.error('Update failed:', err);
      }
    }
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    ));
    setEditingId(null);
    setEditingText('');
    setEditingPriority('Low');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">React TODO App</h1>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Add a new TODO"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={addTodo}
          >
            Add
          </button>
        </div>

        <ul className="space-y-3">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded shadow">
              <button onClick={() => toggleStar(todo.id)} className="mr-2">
                {todo.starred ? "★" : "☆"}
              </button>
              
              <div className="flex-1">
                {editingId === todo.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                    <select 
                      value={editingPriority}
                      onChange={(e) => setEditingPriority(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTodo(todo.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.text}
                    </div>
                    <div className="text-xs text-gray-400">Priority: {todo.priority}</div>
                    <div className="text-xs text-gray-400">Date {todo.date_posted}</div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {editingId !== todo.id && (
                  <>
                    <button 
                      onClick={() => toggleCompleted(todo.id)}
                      className={`px-2 py-1 rounded ${todo.completed ? 'bg-yellow-400 text-white' : 'bg-green-400 text-white'}`}
                      title="Toggle Completed"
                    >
                      {todo.completed ? "Undo" : "Done"}
                    </button>
                    <button 
                      onClick={() => startEditing(todo.id, todo.text, todo.priority)}
                      className="bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;
