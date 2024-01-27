import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllContacts } from './slices/contactsSlice';
import ContactListsSidebar from './ContactListsSidebar';
import ListsDisplay from './ListsDisplay'; 
import {Navigate, useNavigate} from 'react-router-dom'

const ManageToDo = () => {
  const dispatch = useDispatch();
  const [selectedContactId, setSelectedContactId] = useState(null);
  const navigate = useNavigate(); 
  const handleBack = ()=>{
    navigate('/')
  }

  useEffect(() => {
    dispatch(fetchAllContacts());
  }, [dispatch]);

  const handleContactSelect = (contactId) => {
    console.log(`Contact selected with ID: ${contactId}`);
    setSelectedContactId(contactId);
  };

  return (
    <div>
    <button onClick={handleBack}>Back to Home</button>  
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px' }}>
        <ContactListsSidebar onContactSelect={handleContactSelect} />
      </div>
      <div style={{ flexGrow: 1, padding: '0 20px' }}>
        {selectedContactId && <ListsDisplay selectedContactId={selectedContactId} />}
      </div>
    </div>
    </div>
  );
};

export default ManageToDo;
