import { Grid, Typography } from '@mui/material';

import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import useFetch from 'hooks/use-fetch';
import CompanyProfileForm from 'components/forms/CompanyProfileForm';
import { Container } from 'atoms';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';
import { companyProfileBreadcrumbsPage } from 'components/common/breadcrumbsList';
import { useEffect } from 'react';
import { companyId } from 'services/auth';

const CompanyProfilePage = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useFetch<User>(
    `${process.env.REACT_APP_API_URL}/api/v1/company/${companyId}`,
    null
  );

  useEffect(() => {
    if (data) {
      dispatch(uiActions.ChangeBreadcrumb(companyProfileBreadcrumbsPage(data)));
    }
  }, [dispatch, data]);

  return (
    <Container size='large'>
      <Grid container>
        <Grid item width={'100%'}>
          <Typography variant='h4'>Company Profile</Typography>
        </Grid>
        <Grid item width={'100%'}>
          <LoadingSpinnerWrapper loading={loading} error={error}>
            {data && <CompanyProfileForm data={data} id={companyId} />}
          </LoadingSpinnerWrapper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyProfilePage;
