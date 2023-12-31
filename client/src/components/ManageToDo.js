import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContacts } from './slices/contactsSlice';
import { fetchListsAndTodosForContact } from './slices/listsSlice';

const ManageToDo = () => {
  const dispatch = useDispatch();
  const [selectedContactId, setSelectedContactId] = useState('');
  const contacts = useSelector((state) => state.contacts.contacts);
  const lists = useSelector((state) => state.lists.lists);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  useEffect(() => {
    console.log('Contacts:', contacts); // Log to check if contacts are loaded
    if (selectedContactId) {
      dispatch(fetchListsAndTodosForContact(selectedContactId));
    }
  }, [selectedContactId, dispatch, contacts]);

  const handleContactChange = (e) => {
    setSelectedContactId(e.target.value);
  };

  return (
    <div>
      <select onChange={handleContactChange} value={selectedContactId}>
        <option value="">Select Contact</option>
        {contacts.map((contact) => (
          <option key={contact.id} value={contact.id}>
            {contact.name}
          </option>
        ))}
      </select>

      {/* Sidebar and main container logic as before */}
    </div>
  );
};

export default ManageToDo;
