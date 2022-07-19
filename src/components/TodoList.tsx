import { iteratorSymbol } from 'immer/dist/internal';
import React, { Component } from 'react';
import TodoItem from './TodoItem';

export interface TodoListProps {
  id: number;
  createdAt: Date;
  title: string;
  items: [];
}

interface TodoItemProps {
  id: number;
  todoListId: number;
  createdAt: Date;
  title: string;
  task: string;
  deadline: Date;
  completion: boolean;
}

const TodoList = ({id, createdAt, title, items}: TodoListProps) => {
  return (
    <>
      <p>{title}</p>
      <ul>
        {items.map((item: TodoItemProps) => {
          return (
            <TodoItem 
              id={item.id} 
              todoListId={item.todoListId}  
              createdAt={item.createdAt} 
              title={item.title} 
              task={item.task} 
              deadline={item.deadline} 
              completion={item.completion}
          />
          )
        })}
      </ul>
    </>
  );
}

export default TodoList;