import React from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {selectList,fetchListsForUser,fetchAllTodos} from './slices/listsSlice';
import {fetchToDosForList} from './slices/todosSlice';
import '../styles/Sidebar.css'

function Sidebar(){
    const dispatch = useDispatch()
    const lists = useSelector((state) => state.lists.listsByContact[contactId]);
    const todos = useSelector(state=>state.todos.allTodos);
    const status = useSelector((state) => state.lists.status);

    useEffect(() => {
        dispatch(fetchAllTodos());
        if (contactId) {
          dispatch(fetchListsForContact(contactId));
        }
      }, [dispatch, contactId]);

    const filteredTodos = todos.filter(todo=>todo.contact_id === contactId);

    const handleListClick = (listId) => {
        dispatch(fetchToDosForList(listId));
      };
    

    if (status === 'loading') {
        return <div>Loading...</div>; // or any other loading indicator
    }

    if (status === 'failed') {
        return <div>Error: Failed to fetch lists</div>;
    }

    if (!lists) {
        return null; // You can also render a placeholder if lists haven't been fetched yet
    }

    if (!Array.isArray(lists)) {
        return <div>Error: Lists data is not an array</div>;
    }

    // Check if lists array is empty
    if (lists.length === 0) {
        return <div>No lists found</div>;
    }

    return (
        <div className="sidebar">
          {filteredTodos.map((list) => (
            <div key={list.id} onClick={() => handleListClick(list.id)}>
              {list.title}
            </div>
          ))}
        </div>
      );
    }

export default Sidebar;
