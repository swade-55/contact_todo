// ListsDisplay.js
import React from 'react';
import { useSelector } from 'react-redux';
import TodoItem from './TodoItem';

const todoContainerStyle = {
  padding: '20px',
};

const ListsDisplay = ({ selectedContactId }) => {
  const contacts = useSelector((state) => state.contacts.contacts);
  const selectedContact = contacts.find(contact => contact.id === selectedContactId);
  const lists = selectedContact ? selectedContact.lists : [];

  return (
    <div style={todoContainerStyle}>
      {lists.map((list) =>
        list.todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))
      )}
    </div>
  );
};

export default ListsDisplay;
