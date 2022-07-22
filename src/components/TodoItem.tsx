import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';

import { mockapiUrl } from '../utils/mockapiUrl';


export interface TodoItemProps {
  id: number;
  todoListId: number;
  createdAt: Date;
  title: string;
  task: string;
  deadline: Date;
  completion: boolean;
}

interface ItemProps {
  id: number;
  todoListId: number;
  createdAt: Date;
  title: string;
  task: string;
  deadline: Date;
  completion: boolean;
  search: string;
}

const TodoItem = ({ id, todoListId, createdAt, title, task, deadline, completion, search}: ItemProps) => {
  const [checked, setChecked] = useState(completion);
  const [deleted, setDeleted] = useState(false);

  const handleToggle = (value: boolean) => () => {
    setChecked(!value);
  };



  const putTask = async () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        "completion": checked,  
      })
    };
    await fetch(mockapiUrl + "todoLists/" + todoListId + "/todoItems/" + id, requestOptions)
    .then(response => response.json())   
    .then(data => {
      console.log("Data:" + data)
    })
    .catch(error => {console.log(error)})
  };

  const deleteTask = async () => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    await fetch(mockapiUrl + "todoLists/" + todoListId + "/todoItems/" + id, requestOptions)
    .then(response => {
      console.log(response);
    })
    .catch(error => console.log(error))
  };

  useEffect(() => {
    putTask();
  }, [checked]);

  useEffect(() => {
    if(deleted)
      deleteTask();
  }, [deleted]);


  return (
    deleted ? <></> :
    <ListItem
      key={id}
      disablePadding
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={() => setDeleted(true)} >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemButton role={undefined} onClick={handleToggle(checked)} dense disabled={!(title+task).includes(search)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText id={id.toString()} primary={
          <>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2">{task}</Typography>
            <Typography variant="caption">{JSON.stringify(deadline)}</Typography>
          </>
        } />
      </ListItemButton>
    </ListItem>
    
  );
}

export default TodoItem;