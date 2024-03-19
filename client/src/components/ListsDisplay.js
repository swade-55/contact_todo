// ListsDisplay.js
import React from 'react';
import { useSelector } from 'react-redux';
import TodoList from './TodoList';


const todoContainerStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  margin: '20px', // Adjusted margin
  overflow: 'auto', // Add this to handle overflow
  boxSizing: 'border-box', // Include padding and borders in the element's total width and height
  maxWidth: '100%', // Prevent it from exceeding the parent container
};

const listStyle = {
  padding: '10px 20px',
  margin: '10px 0',
  cursor: 'pointer',
  border: '1px solid #e1e1e1', // A subtle border for each item
  borderRadius: '4px', // Rounded corners for each item
  backgroundColor: '#f9f9f9', // A light background color for each item
  transition: 'background-color 0.3s', // Smooth transition for hover effect
};

const titleStyle = {
  fontWeight: 'bold', // Makes the title bold
  fontSize: '1.2em', // Increases the font size for the title
  color: '#333', // Sets a darker color for better readability
  marginBottom: '5px', // Adds spacing below the title
};

// Apply listStyle and titleStyle in the render method


const ListsDisplay = ({ selectedContactId, onSelectList }) => {
  const contacts = useSelector((state) => state.contacts.contacts);
  const selectedContact = contacts.find(contact => contact.id === selectedContactId);
  const lists = selectedContact ? selectedContact.todo_lists : [];
  console.log(selectedContact);

  if (!lists || lists.length === 0) {
    return <div>No lists found</div>;
  }

  return (
    <div style={todoContainerStyle}>
      {lists.map((list) =>
        <div key={list.id} onClick={() => onSelectList(list)}>
          <h3>{list.title}</h3>
        </div>
      )}
    </div>
  );
};

export default ListsDisplay;
