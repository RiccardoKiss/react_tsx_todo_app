import React, { Component } from 'react';
import Checkbox from '@mui/material/Checkbox';

interface TodoItemProps {
  id: number;
  todoListId: number;
  createdAt: Date;
  title: string;
  task: string;
  deadline: Date;
  completion: boolean;
}

const TodoItem = ({ id, todoListId, createdAt, title, task, deadline, completion }: TodoItemProps) => {
  return (
    <li key={id}>
      title:{title}, task:{task}, completion:{completion}
    </li>
  );
}

export default TodoItem;