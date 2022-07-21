import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Formik, Field, Form, FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';

import { mockapiUrl } from '../utils/mockapiUrl';
import { months, days, hours, minutes } from '../utils/dateUtils';

interface formData {
  listTitle: string,
  itemTitle: string,
  itemTask: string,
  dlYear: number,
  dlMonth: number,
  dlDay: number,
  dlHour: number,
  dlMinute: number,
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

const AddList = () => {
  const fullDate = new Date();
  const day = fullDate.getDate();
  const month = fullDate.getMonth()+1;
  const year = fullDate.getFullYear();
  const hour = fullDate.getHours();
  const minute = fullDate.getMinutes();
  const time = hour + ':' + minute;

  const [latestListId, setLatestListId] = useState(0);

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
      //alert(JSON.stringify(values, null, 2));
      //console.log(values);
      //console.log(JSON.stringify(new Date(values.dlYear, values.dlMonth-1, values.dlDay, values.dlHour, values.dlMinute)));
      postList(values);
    },
  });
  
  const getLatestListId = async () => {
    await fetch(mockapiUrl+"todoLists")
    .then(response => response.json())   
    .then(data => {
      setLatestListId(data.length);  // size of List array is 'id' of last List
      console.log(data.length);
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
        //console.log(latestListId);
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
          <Item elevation={6} sx={{width: '110%'}} >
              <form onSubmit={formik.handleSubmit}>
                <Grid container px={1} py={1} spacing={1} direction="column" justifyContent="space-evenly" alignItems="center">
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