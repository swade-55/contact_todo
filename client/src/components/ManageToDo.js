import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllContacts } from './slices/contactsSlice';
import ContactListsSidebar from './ContactListsSidebar';
import ListsDisplay from './ListsDisplay';
import TodoList from './TodoList' 
import {Navigate, useNavigate} from 'react-router-dom'
import {fetchListsForContact, addList} from './slices/listsSlice';
import TodoSidebar from './TodoSidebar';

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
    setTodoSidebarVisible(false);
  };

  useEffect(() => {
    dispatch(fetchAllContacts());
  }, [dispatch]);

  const handleContactSelect = (contactId) => {
    console.log(`Contact selected with ID: ${contactId}`);
    setSelectedContactId(contactId);
    setSelectedList(null);
    dispatch(fetchListsForContact(contactId))
  };

  const handleAddList = ()=>{
    navigate('/add-list')
  }
  const handleAddTag = ()=>{
    navigate('/add-tag')
  }


return (
  <div>
    <button onClick={handleBack}>Back to Home</button>  
    <button onClick={handleAddForm}>Add New Todo</button>  
    <button onClick={handleAddList}>Add New List</button>  
    <button onClick={handleAddTag}>Add New Tag</button> 
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px' }}>
        <ContactListsSidebar onContactSelect={handleContactSelect} />
      </div>
      <div style={{ flexGrow: 1, padding: '0 20px' }}>
        {selectedContactId && !selectedList && 
          <ListsDisplay 
            selectedContactId={selectedContactId} 
            onSelectList={handleListSelect} 
            />}
        </div>
        {todoSidebarVisible && (
          <TodoSidebar
            selectedListObject={selectedList}
            onSelectTodo={setSelectedTodoId}
            onHide={()=>setTodoSidebarVisible(false)}
          />
        )}
        </div>
      </div>
    );
};

export default ManageToDo;
