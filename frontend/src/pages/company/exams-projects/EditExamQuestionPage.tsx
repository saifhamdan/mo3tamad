import { Grid, Typography } from '@mui/material';
import { Container } from 'atoms';
import { examProjectQuestionEditBreadcrumbsPage } from 'components/common/breadcrumbsList';
import QuestionForm from 'components/forms/QuestionForm';

import { useEffect } from 'react';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';

const EditExamQuestionPage = () => {
  const dispatch = useAppDispatch();
  const data = {};

  useEffect(() => {
    dispatch(
      uiActions.ChangeBreadcrumb(examProjectQuestionEditBreadcrumbsPage(data))
    );
  }, [dispatch, data]);

  return (
    <Container size='large'>
      <Grid container>
        <Grid item width={'100%'}>
          <Typography variant='h4'>Edit Question</Typography>
        </Grid>
        <Grid item width={'100%'}>
          <QuestionForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditExamQuestionPage;
