import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ list }) {

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
