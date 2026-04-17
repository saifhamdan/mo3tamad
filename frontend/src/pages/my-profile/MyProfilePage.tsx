import { Grid, Paper, Typography } from '@mui/material';

import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import useFetch from 'hooks/use-fetch';
import MyProfileForm from 'components/forms/MyProfileForm';
import { Container } from 'atoms';

const MyProfilePage = () => {
  const { data, loading, error } = useFetch<User>(
    `${process.env.REACT_APP_API_URL}/api/v1/accounts/me`,
    null
  );

  return (
    <Container>
      <Paper elevation={4} sx={{ p: 4, my: 3 }}>
        <Grid container>
          <Grid item width={'100%'}>
            <Typography variant='h4'>My Profile</Typography>
          </Grid>
          <Grid item width={'100%'}>
            <LoadingSpinnerWrapper loading={loading} error={error}>
              {data && <MyProfileForm data={data} />}
            </LoadingSpinnerWrapper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MyProfilePage;
