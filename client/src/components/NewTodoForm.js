import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from './slices/listsSlice';
import {useNavigate} from 'react-router-dom'
import {fetchAllTags} from './slices/tagsSlice'

const NewToDoForm = ({}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [listId,setListId] = useState('');
  const dispatch = useDispatch();
  const [selectedTags,setSelectedTags] = useState([])
  const tags = useSelector(state=>state.tags.tags);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllTags());
  }, [dispatch]);


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTodo({
      title,
      description,
      list_id: parseInt(listId,10), 
      completed,
      due_date: dueDate ? new Date(dueDate).toISOString() : null, 
      tags:selectedTags,
    }));
    setTitle('');
    setDescription('');
    setDueDate('');
    setCompleted(false);
    setListId('');
    setSelectedTags([]);
  };

  const handleBack = ()=>{
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
        placeholder="Todo title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Todo description"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="Due date"
      />
      <label>
        Completed:
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        <input
          type="number"
          value={listId}
          onChange={(e) => setListId(e.target.value)}
          placeholder="List ID"
          required
        />
        <select
        multiple={true}
        value={selectedTags}
        onChange={(e) => setSelectedTags([...e.target.selectedOptions].map(o => o.value))}
        required>
          {tags.map(tag=>(
            <option key = {tag.id} value = {tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Add Todo</button>
    </form>
    </div>
  );
};

export default NewToDoForm;
