// ListsDisplay.js
import React from 'react';
import { useSelector } from 'react-redux';


const ListsDisplay = ({ selectedContactId, onSelectList }) => {
  const contacts = useSelector((state) => state.contacts.contacts);
  const selectedContact = contacts.find(contact => contact.id === selectedContactId);
  const lists = selectedContact ? selectedContact.todo_lists : [];
  console.log(selectedContact);

  if (!lists || lists.length === 0) {
    return <div>No lists found</div>;
  }

  return (
    <div className="p-5 bg-white rounded-lg shadow-md max-w-full overflow-auto">
      {lists.map((list) =>
        <div key={list.id} onClick={() => onSelectList(list)} className="p-5 my-2 cursor-pointer border border-solid border-gray-200 rounded bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
          <h3 className="font-bold text-xl text-gray-800 mb-2">{list.title}</h3>
        </div>
      )}
    </div>
  );
};

export default ListsDisplay;
