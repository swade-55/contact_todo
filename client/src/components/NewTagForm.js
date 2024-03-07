// NewTagForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { addTag } from './slices/tagsSlice'; 

const NewTagForm = () => {
  const [tagName, setTagName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTag({ name: tagName }));
    setTagName('');
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
        value={tagName}
        onChange={(e) => setTagName(e.target.value)}
        placeholder="Tag Name"
        required
      />
      <button type="submit">Add Tag</button>
    </form>
    </div>
  );
};

export default NewTagForm;
