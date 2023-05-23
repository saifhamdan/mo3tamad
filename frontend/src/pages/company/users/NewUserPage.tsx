import { Grid, Typography } from '@mui/material';
import { Container } from 'atoms';
import { newUsersBreadcrumbsPage } from 'components/common/breadcrumbsList';

import UserForm from 'components/forms/UserForm';
import { useEffect } from 'react';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';

const NewUserPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(uiActions.ChangeBreadcrumb(newUsersBreadcrumbsPage));
  }, [dispatch]);
  return (
    <Container size='large'>
      <Grid container>
        <Grid item width={'100%'}>
          <Typography variant='h4'>New User</Typography>
        </Grid>
        <Grid item width={'100%'}>
          <UserForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewUserPage;
