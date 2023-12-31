import React from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {selectList,fetchListsForUser} from './slices/listsSlice';
import {fetchToDosForList} from './slices/todosSlice';
import '../styles/Sidebar.css'

function Sidebar(){
    const dispatch = useDispatch()
    const lists = useSelector(state=>state.lists.lists);

    useEffect(()=>{
        dispatch(fetchListsForUser(1));
    },[dispatch])

    const handleListClick = (listId)=>{
        dispatch(selectList(listId))
        dispatch(fetchToDosForList(listId))
    }
    return (
        <div className="sidebar">
            {lists.map(list=>{
                <div key = {lists.id} onClick={()=>handleListClick(list.id)}>
                {lists.title}
            </div>
            })}
        </div>
    )
}

export default Sidebar;