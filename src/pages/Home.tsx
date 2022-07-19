import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import TodoList from '../components/TodoList';

interface TodoListProps {
  id: number;
  createdAt: Date;
  title: string;
  items: [];
}

const Home = () => {
  const mockapi = "https://62d695c251e6e8f06f0d98e8.mockapi.io/";
  const [isLoaded, setIsLoaded] = useState(false);
  const [todoLists, setTodoLists] = useState([]);

  const fullDate = new Date();
  const day = fullDate.getDate();
  const month = fullDate.getMonth()+1;
  const year = fullDate.getFullYear();
  const time = fullDate.getHours() + ':' + fullDate.getMinutes();
  const jsonDate = JSON.stringify(fullDate);

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
    if(!isLoaded) getTodoLists(mockapi);
    //getTodoLists(mockapi);
    console.log("todoLists2:");
    console.dir(todoLists);
  }, [todoLists]);

  return (
    <>
      <p>{day}.{month}.{year} | {time} | {jsonDate}</p>
      {todoLists.map((item: TodoListProps) => {
        return (
          <TodoList 
            id={item.id} 
            title={item.title} 
            createdAt={item.createdAt} 
            items={item.items}
          />
        )
      })}
      
      <Link to={"/todoList"}>go to todoList</Link> 
      <Button href='/todoList' color='primary' variant='contained'>+ Add List</Button>
      <IconButton aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </>
  )
}

export default Home;