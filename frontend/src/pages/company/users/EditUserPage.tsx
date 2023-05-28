import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import useFetch from 'hooks/use-fetch';
import UserForm from 'components/forms/UserForm';
import { companyId } from 'services/auth';
import { Container } from 'atoms';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';
import { editUsersBreadcrumbsPage } from 'components/common/breadcrumbsList';
import { useEffect } from 'react';

const EditUserPage = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const { data, loading, error } = useFetch<User>(
    `${process.env.REACT_APP_API_URL}/api/v1/users/${userId}`,
    null
  );

  useEffect(() => {
    dispatch(uiActions.ChangeBreadcrumb(editUsersBreadcrumbsPage(data)));
  }, [dispatch, data]);

  return (
    <Container size='large'>
      <Grid container>
        <Grid item width={'100%'}>
          <Typography variant='h4'>Edit User</Typography>
        </Grid>
        <Grid item width={'100%'}>
          <LoadingSpinnerWrapper loading={loading} error={error}>
            {data && <UserForm data={data} id={userId} />}
          </LoadingSpinnerWrapper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditUserPage;
