// TodoItem.js
import React from 'react';

const todoItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff', // White background as per the screenshot
  padding: '10px',
  margin: '10px 0',
  borderRadius: '6px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // subtle shadow to match the screenshot
};

const todoCheckboxStyle = {
  alignSelf: 'flex-start',
};

const todoTitleStyle = {
  margin: '5px 0 10px 0',
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#333', // Dark text for readability
};

const tagStyle = {
  display: 'inline-block',
  backgroundColor: '#e0e0e0', // Light grey background for tags
  borderRadius: '15px',
  padding: '5px 10px',
  margin: '2px',
  fontSize: '12px',
  fontWeight: 'normal',
};

const TodoItem = ({ todo }) => {
  return (
    <div style={todoItemStyle}>
      <input
        type="checkbox"
        style={todoCheckboxStyle}
        checked={todo.completed}
        onChange={() => {}} // Handle change
      />
      <div style={todoTitleStyle}>{todo.title}</div>
      <div>
        {todo.tags.map(tag => (
          <span key={tag.id} style={tagStyle}>{tag.name}</span>
        ))}
      </div>
    </div>
  );
};

export default TodoItem;
