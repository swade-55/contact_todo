// TodoSidebar.js
import React from 'react';
import TodoItem from './TodoItem';

const TodoSidebar = ({ selectedListObject, onSelectTodo, onHide }) => {
  const completedTodos = selectedListObject?.todos?.filter(todo => todo.completed);
  const availableTodos = selectedListObject?.todos?.filter(todo => !todo.completed);

  
  return (
    <div className="sidebar bg-base-100 text-base-content w-64 space-y-4 p-4">

        <div>
            <h2 className="sidebar-title text-lg font-bold">Available Todos</h2>
          <div className="menu menu-compact bg-base-100 p-2 rounded-box">
            {availableTodos?.map(todo => (
              <div key={todo.id} onClick={() => onSelectTodo(todo.id)} className="menu-item">
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
            <h2 className="sidebar-title text-lg font-bold">Completed Todos</h2>
          <div className="menu menu-compact bg-base-100 p-2 rounded-box">
            {completedTodos?.map(todo => (
              <div key={todo.id} onClick={() => onSelectTodo(todo.id)} className="menu-item">
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
        </div>

    </div>
  );
};

export default TodoSidebar;
