import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ContactListsSidebar from './ContactListsSidebar';
import ListsDisplay from './ListsDisplay';
import { useNavigate } from 'react-router-dom'
import TodoSidebar from './TodoSidebar';


const ManageToDo = () => {
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [selectedList, setSelectedList] = useState({});
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [todoSidebarVisible, setTodoSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/')
  }


  const handleAddForm = () => {
    navigate('/add-todo')
  }

  const handleListSelect = (listObject) => {
    console.log(`List selected with ID:`, listObject);
    setSelectedList(listObject);
    setTodoSidebarVisible(true);
  };

  const lists = useSelector((state) => state.contacts.contacts);
  console.log("These are my lists", lists)

  const handleContactSelect = (contactId) => {
    console.log(`Contact selected with ID: ${contactId}`);
    setSelectedContactId(contactId);
    setSelectedList(null);
  };

  const handleAddList = () => {
    navigate('/add-list')
  }
  const handleAddTag = () => {
    navigate('/add-tag')
  }


  return (
    <div className="flex flex-col h-screen">
      <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
        <div className="flex-none">
          <button onClick={handleBack} className="btn btn-primary">Back to Home</button>
          <button onClick={handleAddForm} className="btn btn-accent">Add New Todo</button>
          <button onClick={handleAddList} className="btn btn-accent">Add New List</button>
          <button onClick={handleAddTag} className="btn btn-accent">Add New Tag</button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <ContactListsSidebar onContactSelect={handleContactSelect} />
        </div>
        <div className="flex-grow p-4">
          {selectedContactId &&
            <ListsDisplay
              selectedContactId={selectedContactId}
              onSelectList={handleListSelect}
            />}
        </div>
        {todoSidebarVisible && (
          <div className="w-64 flex-shrink-0">
            <TodoSidebar
              selectedListObject={selectedList}
              onSelectTodo={setSelectedTodoId}
              onHide={() => setTodoSidebarVisible(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageToDo;
