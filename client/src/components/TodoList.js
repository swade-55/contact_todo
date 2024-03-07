import React from 'react';
import '../styles/TodoList.css';
import TodoItem from './TodoItem';
import {useSelector} from 'react-redux'

function TodoList({ list }) {
  // Define inline styles
  const styles = {
    container: {
      backgroundColor: '#f2f2f2',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '10px',
      maxWidth: '400px',
      margin: '20px auto',
    },
    todoItem: {
      backgroundColor: '#fff',
      borderRadius: '2px',
      padding: '10px 15px',
      margin: '5px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    },
    todoText: {
      fontSize: '16px',
    },
    checkbox: {
      marginRight: '10px',
    }
  };

  const handleTodoClick = (todoId)=>{
    console.log(`Todo clicked with ID: ${todoId}`)
  }

  return (
    <div>
      <h3>{list.title}</h3>
      {list.todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onClick={() => handleTodoClick(todo.id)} />
      ))}
    </div>
  );
};


export default TodoList;
