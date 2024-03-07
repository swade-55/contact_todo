// ListsDisplay.js
import React from 'react';
import { useSelector } from 'react-redux';
import TodoList from './TodoList';

const todoContainerStyle = {
  padding: '20px',
};

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
