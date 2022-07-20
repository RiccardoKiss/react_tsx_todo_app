import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import { mockapiUrl } from '../utils/mockapiUrl';


const MyAppBar = styled(AppBar)(() => ({
  backgroundColor: '#2d3a52',
  marginBottom: '3%',
}));

const MyToolBar = styled(Toolbar)(() => ({
  justifyContent: 'space-between',
}));

const AddList = () => {
  const fullDate = new Date();
  const day = fullDate.getDate();
  const month = fullDate.getMonth()+1;
  const year = fullDate.getFullYear();
  const time = fullDate.getHours() + ':' + fullDate.getMinutes();

  const [title, setTitle] = useState("");

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = () => {
    
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
          <Box component="form" sx={{'& > :not(style)': { m: 1 }}} noValidate autoComplete="off">
            <FormControl variant="standard">
              <InputLabel htmlFor="component-simple">Title</InputLabel>
              <Input id="component-simple" value={title} onChange={handleTitleChange} />
            </FormControl>
          </Box>
        </Grid>
        <Grid item>
          <Button href='/' color='primary' variant='contained' onClick={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddList;