import React from 'react';
import '../styles/TodoItem.css';

function TodoItem({ title }) {
  return (
    <div className="todo-item">
      <input type="checkbox" />
      <div className="item-title">{title}</div>
    </div>
  );
}

export default TodoItem;
