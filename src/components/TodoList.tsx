import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import TodoItem, { TodoItemProps } from './TodoItem';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { mockapiUrl } from '../utils/mockapiUrl';
import { months, days, hours, minutes } from '../utils/dateUtils';


export interface TodoListProps {
  id: number;
  createdAt: Date;
  title: string;
  items: [];
}

interface formData {
  itemTitle: string,
  itemTask: string,
  dlYear: number,
  dlMonth: number,
  dlDay: number,
  dlHour: number,
  dlMinute: number,
};

const Item = styled(Paper)(() => ({
  backgroundColor: '#f2bb72',
  padding: '3%',
  textAlign: 'start',
}));

const validationSchema = yup.object({
  itemTitle: yup
    .string()
    .required('Task title is required'),
  itemTask: yup
    .string()
    .required('Task description is required'),
  dlYear: yup
    .number()
    .positive()
    .integer()
    .min(new Date().getFullYear())
    .required('Year is required'),
  dlMonth: yup
    .number()
    .integer()
    .min(1)
    .max(12)
    .required('Month is required'),
  dlDay: yup
    .number()
    .integer()
    .min(1)
    .max(31)
    .required('Day is required'),
  dlHour: yup
    .number()
    .integer()
    .min(0)
    .max(23)
    .required('Hour is required'),
  dlMinute: yup
    .number()
    .integer()
    .min(0)
    .max(59)
    .required('Minute is required'),
});


const TodoList = ({id, createdAt, title, items}: TodoListProps) => {
  const fullDate = new Date();
  const day = fullDate.getDate();
  const month = fullDate.getMonth()+1;
  const year = fullDate.getFullYear();
  const hour = fullDate.getHours();
  const minute = fullDate.getMinutes();
  const [displayItemForm, setDisplayItemForm] = useState(false);
  const [tasks, setTasks] = useState(items);

  const postItem = async (values: formData) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "createdAt": new Date(),
        "title": values.itemTitle,
        "task": values.itemTask,
        "deadline": new Date(values.dlYear, values.dlMonth-1, values.dlDay, values.dlHour, values.dlMinute),
        "completion": false,
      })
    };
    await fetch(mockapiUrl+"todoLists/" + id + "/todoItems", requestOptions)
    .then(async (response) => {
      if(response.status == 201) {
        await fetch(mockapiUrl+"todoLists/" + id + "/todoItems")
        .then(response => response.json())
        .then(data => setTasks(data))
      }
    })
    .catch(error => {alert(error)})
  };

  const formik = useFormik({
    initialValues: {
      listTitle: '',
      itemTitle: '',
      itemTask: '',
      dlYear: year,
      dlMonth: month,
      dlDay: day,
      dlHour: hour,
      dlMinute: minute,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postItem(values);
      setDisplayItemForm(false);
    },
  });



  return (
    <Item elevation={2}>
      <Typography variant='h4' fontWeight={'bold'}>#{id}: {title}</Typography>
      <List sx={{ width: '100%', maxWidth: 500,  bgcolor: '#f5ce9a' }}>
        {
          tasks.map((item: TodoItemProps) => {
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
      { !displayItemForm ? <></> :
        <form onSubmit={formik.handleSubmit}>
          <Grid container px={1} py={1} spacing={1} direction="column" justifyContent="space-evenly" alignItems="center">
          <Grid item>
            <TextField 
              id="itemTitle" 
              name="itemTitle" 
              label="Item Title" 
              variant="filled"
              size="small"
              color={formik.values.itemTask ? "success" : "primary"}
              value={formik.values.itemTitle}
              onChange={formik.handleChange} 
              error={formik.touched.itemTitle && Boolean(formik.errors.itemTitle)}
              helperText={formik.touched.itemTitle && formik.errors.itemTitle}
            />
          </Grid>
          <Grid item>
            <TextField 
              id="itemTask" 
              name="itemTask" 
              label="Item Task" 
              variant="standard"
              multiline
              rows={3}
              color={formik.values.itemTask ? "success" : "primary"}
              value={formik.values.itemTask}
              onChange={formik.handleChange}
              error={formik.touched.itemTask && Boolean(formik.errors.itemTask)}
              helperText={formik.touched.itemTask && formik.errors.itemTask}
            />
          </Grid>
          <Grid container direction="row" pt={2} justifyContent="space-evenly" alignItems="center" >
            <Grid item>
              <TextField 
                sx={{width: '8ch'}}
                id="dlYear" 
                name="dlYear" 
                label="Year" 
                variant="outlined"
                value={formik.values.dlYear}
                onChange={formik.handleChange}
                error={formik.touched.dlYear && Boolean(formik.errors.dlYear)}
                helperText={formik.touched.dlYear && formik.errors.dlYear}
              />
            </Grid>
            <Grid item>
              <TextField 
                select
                sx={{width: '15ch'}}
                id="dlMonth" 
                name="dlMonth" 
                label="Month" 
                variant="outlined"
                value={formik.values.dlMonth}
                onChange={formik.handleChange}
                error={formik.touched.dlMonth && Boolean(formik.errors.dlMonth)}
                helperText={formik.touched.dlMonth && formik.errors.dlMonth}
              >
                {months.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField 
                select
                id="dlDay" 
                name="dlDay" 
                label="Day" 
                variant="outlined"
                value={formik.values.dlDay}
                onChange={formik.handleChange}
                error={formik.touched.dlDay && Boolean(formik.errors.dlDay)}
                helperText={formik.touched.dlDay && formik.errors.dlDay}
              >
                {days.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField 
                select
                id="dlHour" 
                name="dlHour" 
                label="Hour" 
                variant="outlined"
                value={formik.values.dlHour}
                onChange={formik.handleChange}
                error={formik.touched.dlHour && Boolean(formik.errors.dlHour)}
                helperText={formik.touched.dlHour && formik.errors.dlHour}
              >
                {hours.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField 
                select
                id="dlMinute" 
                name="dlMinute" 
                label="Minute" 
                variant="outlined"
                value={formik.values.dlMinute}
                onChange={formik.handleChange}
                error={formik.touched.dlMinute && Boolean(formik.errors.dlMinute)}
                helperText={formik.touched.dlMinute && formik.errors.dlMinute}
              >
                {minutes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            </Grid>
            <Grid item>
              <Button color='success' variant='contained' type='submit'>Confirm</Button>
            </Grid>
          </Grid>
        </form>
      }
      <Box mt={2} ml={'35%'}>
        <Button color='primary' variant='contained' onClick={() => setDisplayItemForm(true)}>+ Add item</Button>
      </Box>
    </Item>
  );
}

export default TodoList;