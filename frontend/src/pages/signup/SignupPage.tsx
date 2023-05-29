import { ArrowBack } from '@mui/icons-material';
import {
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { BusinessIcon, PersonIcon } from 'atoms/icons';
import CompanyForm from 'components/forms/CompanyForm';
import SignupForm from 'components/forms/SignupForm';
import React, { useState } from 'react';

const SelectSignupType: React.FC<{ activeSteps: (st: number) => void }> = ({
  activeSteps,
}) => {
  return (
    <Grid width={'100%'} height={'100%'}>
      <Typography variant='h5'>Choose signup type</Typography>
      <Grid
        container
        width={'100%'}
        height={'100%'}
        alignItems='center'
        justifyContent='center'
      >
        <Grid item mr={1} onClick={() => activeSteps(1)}>
          <Paper elevation={4} sx={{ p: 3, cursor: 'pointer', width: 150 }}>
            <Grid container flexDirection='column' alignItems={'center'}>
              <PersonIcon sx={{ fontSize: 70 }} color='primary' />
              <Typography variant='h5'>Student</Typography>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Divider orientation='vertical' variant='fullWidth' />
        </Grid>
        <Grid item onClick={() => activeSteps(2)}>
          <Paper elevation={4} sx={{ p: 3, cursor: 'pointer', width: 150 }}>
            <Grid container flexDirection='column' alignItems={'center'}>
              <BusinessIcon sx={{ fontSize: 70 }} color='primary' />
              <Typography variant='h5'>Company</Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

const SignupPage = () => {
  const [steps, setSteps] = useState(0);

  const activeSteps = (st: number) => {
    setSteps(st);
  };

  const backwardStep = () => {
    setSteps(0);
  };

  return (
    <Grid container maxWidth={'100%'} width={600} className='centered-div'>
      <Paper elevation={4} sx={{ p: 3, width: '100%', minHeight: 500 }}>
        <Grid container alignItems='center'>
          {steps !== 0 && (
            <Tooltip title='back'>
              <IconButton onClick={backwardStep}>
                <ArrowBack />
              </IconButton>
            </Tooltip>
          )}
          <Typography variant='h5'>
            {steps === 1 && 'Create Account'}
            {steps === 2 && 'Create Company Account'}
          </Typography>
        </Grid>
        {steps === 0 && <SelectSignupType activeSteps={activeSteps} />}
        {steps === 1 && (
          <Grid item>
            <SignupForm />
          </Grid>
        )}
        {steps === 2 && (
          <Grid item>
            <CompanyForm />
          </Grid>
        )}
        {steps === 3 && <Grid item></Grid>}
      </Paper>
    </Grid>
  );
};

export default SignupPage;
