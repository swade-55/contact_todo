import React from 'react';
import '../styles/TodoList.css';
import TodoItem from './TodoItem';
import {useSelector} from 'react-redux'

function TodoList() {
  const todos = useSelector(state=>state.todos.items)
  
  return (
    <div className="todo-list">
      {todos.map(todo=>(
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  );
}

export default TodoList;
