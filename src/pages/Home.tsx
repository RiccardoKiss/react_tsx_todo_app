import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import TodoList, { TodoListProps } from '../components/TodoList';
import { mockapiUrl } from '../utils/mockapiUrl';


const MyAppBar = styled(AppBar)(() => ({
  backgroundColor: '#2d3a52',
  marginBottom: '3%',
}));

const MyToolBar = styled(Toolbar)(() => ({
  justifyContent: 'space-between',
}));

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [todoLists, setTodoLists] = useState([]);

  const fullDate = new Date();
  const day = fullDate.getDate();
  const month = fullDate.getMonth()+1;
  const year = fullDate.getFullYear();
  const time = fullDate.getHours() + ':' + fullDate.getMinutes();

  const getTodoLists = async (url: string) => {
    url += "todoLists";
    await fetch(url)
    .then(response => response.json())   
    .then(data => {
      console.log("Data:");
      console.dir(data);
      //setTodoLists([...todoLists, data]);
      setTodoLists(data);
      setIsLoaded(true);
      console.log("todoLists1:");
      console.dir(todoLists);
    })
    .catch(error => {console.log(error)})
  }

  useEffect(() => {
    if(!isLoaded) getTodoLists(mockapiUrl);
    //getTodoLists(mockapi);
    console.log("todoLists2:");
    console.dir(todoLists);
  }, [todoLists]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MyAppBar position="static">
        <MyToolBar>
          <Typography variant='subtitle1'>{day}.{month}.{year} | {time}</Typography>
          <Typography variant='h5'>TODO App</Typography>
          <Button href='/todoList' color='success' variant='contained'>+ Add List</Button>
        </MyToolBar>
      </MyAppBar>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12}} justifyContent="space-evenly">
        {todoLists.map((item: TodoListProps) => {
          return (
            <Grid item xs={2} sm={4} md={3}>
              <TodoList 
                id={item.id} 
                title={item.title} 
                createdAt={item.createdAt} 
                items={item.items}
              />
              <br></br>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default Home;