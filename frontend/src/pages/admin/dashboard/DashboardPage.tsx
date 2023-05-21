import React, { Fragment, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';

import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';
import { accountId } from 'services/auth';

const OrgDetails: React.FC<{ data: any }> = ({ data }) => {
  return (
    // <Paper sx={{ width: 'fit-content', p: 2 }}>
    <Grid my={2} container width='300px' minWidth='max-content'>
      {/* {OrgDetailsMap.map((d, i) => (
        <Fragment key={i}>
          <Grid item xs={3}>
            <Typography variant='subtitle1' color='GrayText'>
              {d.label}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant='subtitle1'>{d.data(data)}</Typography>
          </Grid>
        </Fragment>
      ))} */}
    </Grid>
    // </Paper>
  );
};

const url = `${process.env.REACT_APP_API_URL}/api/v1/accounts/${accountId}/organizations/details`;
const DasboardPage = () => {
  const dispatch = useAppDispatch();
  // const { data, loading, error } = useFetch<any>(url, null);

  // useEffect(() => {
  //   dispatch(uiActions.ChangeBreadcrumb(dashboardBreadcrumbsPage));
  // }, []);

  return (
    <div>Dashboard</div>
    // <LoadingSpinnerWrapper loading={loading} error={error}>
    // </LoadingSpinnerWrapper>
  );
};

export default DasboardPage;
