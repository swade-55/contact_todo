// TodoSidebar.js
import React, {useState} from 'react';
import TodoItem from './TodoItem';

const TodoSidebar = ({ selectedListObject, onSelectTodo, onHide }) => {
  const completedTodos = selectedListObject?.todos?.filter(todo => todo.completed);
  const availableTodos = selectedListObject?.todos?.filter(todo => !todo.completed);

  const toggleSidebarVisibility = () => {
    onHide();
  };
  
  return (
    <div style={{ width: '250px', padding: '10px' }}>

      <button onClick={onHide}>Hide Todo Sidebar</button>
        <div>
          <div>
            <h2>Available Todos</h2>
            {availableTodos?.map(todo => (
              <div key={todo.id} onClick={() => onSelectTodo(todo.id)}>
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
          <div>
            <h2>Completed Todos</h2>
            {completedTodos?.map(todo => (
              <div key={todo.id} onClick={() => onSelectTodo(todo.id)}>
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
        </div>

    </div>
  );
};

export default TodoSidebar;
