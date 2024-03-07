import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { addList } from './slices/listsSlice'; 

const NewListForm = () => {
  const [title, setTitle] = useState('');
  const [contactId, setContactId] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addList({
      title,
      contact_id: parseInt(contactId, 10), 
    }));
    // Reset form fields
    setTitle('');
    setContactId('');
  };

  const handleBack=()=>{
    navigate('/manage-todo')
  }

  return (
    <div>
      <button onClick={handleBack}>Back to Manage Todo</button>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="List title"
        required
      />
      <input
        type="number"
        value={contactId}
        onChange={(e) => setContactId(e.target.value)}
        placeholder="Contact ID"
        required
      />
      <button type="submit">Add List</button>
    </form>
    </div>
  );
};

export default NewListForm;
