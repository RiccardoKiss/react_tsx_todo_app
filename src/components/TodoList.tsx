import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';

import TodoItem, { TodoItemProps } from './TodoItem';
import { mockapiUrl } from '../utils/mockapiUrl';
import { colors, Typography } from '@mui/material';

export interface TodoListProps {
  id: number;
  createdAt: Date;
  title: string;
  items: [];
}

const Item = styled(Paper)(() => ({
  backgroundColor: '#f2bb72',
  padding: '3%',
  textAlign: 'start',
}));

const TodoList = ({id, createdAt, title, items}: TodoListProps) => {
  return (
    <Item>
      <Typography variant='h4' fontWeight={'bold'}>#{id}: {title}</Typography>
      <List sx={{ width: '100%', maxWidth: 500,  bgcolor: '#f5ce9a' }}>
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
    </Item>
  );
}

export default TodoList;