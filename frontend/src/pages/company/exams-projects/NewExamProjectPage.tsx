import { Grid, Typography } from '@mui/material';
import { Container } from 'atoms';
import { newExamProjectBreadcrumbsPage } from 'components/common/breadcrumbsList';
import ExamProjectForm from 'components/forms/ExamProjectForm';

import { useEffect } from 'react';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';

const NewExamProjectPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(uiActions.ChangeBreadcrumb(newExamProjectBreadcrumbsPage));
  }, [dispatch]);

  return (
    <Container size='large'>
      <Grid container>
        <Grid item width={'100%'}>
          <Typography variant='h4'>New Exam Project</Typography>
        </Grid>
        <Grid item width={'100%'}>
          <ExamProjectForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewExamProjectPage;
