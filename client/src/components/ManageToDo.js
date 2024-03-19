import React, { useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ContactListsSidebar from './ContactListsSidebar';
import ListsDisplay from './ListsDisplay';
import {useNavigate} from 'react-router-dom'
import TodoSidebar from './TodoSidebar';


const contentContainerStyle = {
  display: 'flex', // Use flex for horizontal layout
  flexGrow: 1, // Allow the container to expand to fill the available space
  overflow: 'hidden', // Prevent any child from overflowing
};
const headerStyle = {
};

const ManageToDo = () => {
  const dispatch = useDispatch();
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [selectedList, setSelectedList] = useState({});
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [todoSidebarVisible, setTodoSidebarVisible] = useState(false);
  const navigate = useNavigate(); 
  const handleBack = ()=>{
    navigate('/')
  }


  const handleAddForm = ()=>{
    navigate('/add-todo')
  }

  const handleListSelect = (listObject) => {
    console.log(`List selected with ID:`,listObject);
    setSelectedList(listObject);
    setTodoSidebarVisible(true);
  };

  const lists = useSelector((state) => state.contacts.contacts);
  console.log("These are my lists",lists)

  const handleContactSelect = (contactId) => {
    console.log(`Contact selected with ID: ${contactId}`);
    setSelectedContactId(contactId);
    setSelectedList(null);
  };

  const handleAddList = ()=>{
    navigate('/add-list')
  }
  const handleAddTag = ()=>{
    navigate('/add-tag')
  }


return (
  <div >
    <div style={headerStyle}>
    <button onClick={handleBack}>Back to Home</button>  
    <button onClick={handleAddForm}>Add New Todo</button>  
    <button onClick={handleAddList}>Add New List</button>  
    <button onClick={handleAddTag}>Add New Tag</button> 
    </div>
    <div style={contentContainerStyle}>
      <div style={{ width: '250px' }}>
        <ContactListsSidebar onContactSelect={handleContactSelect} />
      </div>
      <div style={{ flexGrow: 1, padding: '0 20px' }}>
        {selectedContactId && 
          <ListsDisplay 
            selectedContactId={selectedContactId} 
            onSelectList={handleListSelect} 
            />}
        </div>
        {todoSidebarVisible && (
          <TodoSidebar
            selectedListObject={selectedList}
            onSelectTodo={setSelectedTodoId}
            onHide={()=>setTodoSidebarVisible(true)}
          />
        )}
        </div>
        </div>
    );
};

export default ManageToDo;
