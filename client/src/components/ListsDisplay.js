import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchListsForContact } from './slices/listsSlice';

const ListsDisplay = ({ selectedContactId }) => {
  const dispatch = useDispatch();
  const lists = useSelector((state) => state.lists.listsByContact[selectedContactId] || []);

  useEffect(() => {
    if (selectedContactId) {
      dispatch(fetchListsForContact(selectedContactId));
    }
  }, [selectedContactId, dispatch]);

  return (
    <div>
      {lists.map((list) => (
        <div key={list.id}>{list.title}</div>
      ))}
    </div>
  );
};

export default ListsDisplay;
