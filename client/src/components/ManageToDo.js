import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllContacts } from './slices/contactsSlice';
import ContactListsSidebar from './ContactListsSidebar';
import ListsDisplay from './ListsDisplay'; // New import for the ListsDisplay component

const ManageToDo = () => {
  const dispatch = useDispatch();
  const [selectedContactId, setSelectedContactId] = useState('');
  const contacts = useSelector((state) => state.contacts.contacts);

  useEffect(() => {
    dispatch(fetchAllContacts());
  }, [dispatch]);

  const handleContactSelect = (contactId) => {
    setSelectedContactId(contactId);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px' }}> {/* Adjusted for better layout */}
        {/* Assuming ContactListsSidebar is now used to select a contact */}
        <ContactListsSidebar onContactSelect={handleContactSelect} />
      </div>
      <div style={{ flexGrow: 1, padding: '0 20px' }}> {/* Adjusted for better layout */}
        {/* Render ListsDisplay when a contact is selected */}
        {selectedContactId && <ListsDisplay selectedContactId={selectedContactId} />}
      </div>
    </div>
  );
};

export default ManageToDo;
