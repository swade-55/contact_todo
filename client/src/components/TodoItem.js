// TodoItem.js
import React from 'react';

const todoItemStyle = (completed) => ({
  backgroundColor: completed ? '#f9f9f9' : '#ffffff', // Light grey if completed, white if not
  borderRadius: '4px',
  padding: '10px 15px',
  marginBottom: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  display: 'flex',
  alignItems: 'center',
  textDecoration: completed ? 'line-through' : 'none',
  color: completed ? '#d3d3d3' : 'inherit',
});

const customCheckboxStyle = (completed) => ({
  width: '18px',
  height: '18px',
  border: '2px solid #d3d3d3', // Light grey border
  borderRadius: '50%', // Circular border
  display: 'inline-block',
  marginRight: '10px',
  position: 'relative', // To position the checkmark absolutely within the checkbox
  backgroundColor: completed ? '#0078d7' : 'transparent', // Microsoft blue if completed
});

const TodoItem = ({ todo }) => {
  // Function to toggle the completed state - you'll need to implement this
  const toggleCompleted = () => {
    // Implement the toggle functionality
  };

  return (
    <div style={todoItemStyle(todo.completed)} onClick={toggleCompleted}>
      <div style={customCheckboxStyle(todo.completed)}>
        {/* Checkmark would be a styled element or an icon */}
      </div>
      <div>
        {todo.title}
      </div>
    </div>
  );
};

export default TodoItem;
