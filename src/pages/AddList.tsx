import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Formik, Field, Form, FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';

import { mockapiUrl } from '../utils/mockapiUrl';

interface formData {
  listTitle: string,
  itemTitle: string,
  itemTask: string,
};

const MyAppBar = styled(AppBar)(() => ({
  backgroundColor: '#2d3a52',
  marginBottom: '3%',
}));

const MyToolBar = styled(Toolbar)(() => ({
  justifyContent: 'space-between',
}));

const Item = styled(Paper)(() => ({
  backgroundColor: '#f2bb72',
  padding: '3%',
  //justifyContent: 'space-evenly',
}));

const validationSchema = yup.object({
  listTitle: yup
    .string()
    .required('List title is required'),
  itemTitle: yup
    .string()
    .required('Task title is required'),
  itemTask: yup
    .string()
    .required('Task description is required'),
});

const AddList = () => {
  const fullDate = new Date();
  const day = fullDate.getDate();
  const month = fullDate.getMonth()+1;
  const year = fullDate.getFullYear();
  const time = fullDate.getHours() + ':' + fullDate.getMinutes();

  const [formData, setFormData] = useState({});
  const [todoLists, setTodoLists] = useState([]);
  const [latestListId, setLatestListId] = useState(0);

  const formik = useFormik({
    initialValues: {
      listTitle: '',
      itemTitle: '',
      itemTask: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2));
      setFormData(values);
      postList(values);
    },
  });
  
  const getLatestListId = async () => {
    await fetch(mockapiUrl+"todoLists")
    .then(response => response.json())   
    .then(data => {
      setLatestListId(data.length);  // size of List array is 'id' of last List
    })
    .catch(error => {console.log(error)})
  };

  const postList = async (values: formData) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "createdAt": new Date(),
        "title": values.listTitle,
      })
    };
    await fetch(mockapiUrl+"todoLists", requestOptions)
    .then(async (response) => {
      if(response.status == 201) {
        await getLatestListId();
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "createdAt": new Date(),
            "title": values.itemTitle,
            "task": values.itemTask,
            "deadline": new Date(),
            "completion": false,
          })
        };
        await fetch(mockapiUrl+"todoLists/" + (latestListId+1).toString() + "/todoItems", requestOptions)
        .then(response => {
          if(response.status == 201) 
            alert("Item added successfully.")
        })
        .catch(error => {alert(error)})
      }
    })
    .catch(error => {alert(error)})
  };

  useEffect(() => {
    if(Object.keys(formData).length != 0)  // if object is not empty
      console.log(formData);
  }, [formData]);


  return (
    <Box sx={{ flexGrow: 1 }}>
      <MyAppBar position="static">
        <MyToolBar>
          <Button href='/' color='secondary' variant='contained'>Back</Button>
          <Typography variant='h5'>TODO App</Typography>
          <Typography variant='subtitle1'>{day}.{month}.{year} | {time}</Typography>
        </MyToolBar>
      </MyAppBar>
      <Grid container direction="column" spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <Item elevation={6} >
              <form onSubmit={formik.handleSubmit}>
                <Grid container  px={2} py={1} spacing={3} direction="column" justifyContent="space-evenly" alignItems="center">
                  <Grid item>
                    <TextField 
                      id="listTitle" 
                      name="listTitle" 
                      label="List Title" 
                      variant="filled"
                      size="small"
                      color={formik.values.itemTask ? "success" : "primary"}
                      value={formik.values.listTitle}
                      onChange={formik.handleChange}
                      error={formik.touched.listTitle && Boolean(formik.errors.listTitle)}
                      helperText={formik.touched.listTitle && formik.errors.listTitle}
                    />
                  </Grid>
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
                  <Grid item>
                    <Button color='primary' variant='contained' type='submit'>SUBMIT</Button>
                  </Grid>
                </Grid>
              </form>
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddList;