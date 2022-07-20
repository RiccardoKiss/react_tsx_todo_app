import { iteratorSymbol } from 'immer/dist/internal';
import React, { useState } from 'react';
import TodoItem, { TodoItemProps } from './TodoItem';
import List from '@mui/material/List';
import { mockapiUrl } from '../utils/mockapiUrl';

export interface TodoListProps {
  id: number;
  createdAt: Date;
  title: string;
  items: [];
}

const TodoList = ({id, createdAt, title, items}: TodoListProps) => {

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {
        items.map((item: TodoItemProps) => {
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
        })
      }
    </List>
  );
}

export default TodoList;