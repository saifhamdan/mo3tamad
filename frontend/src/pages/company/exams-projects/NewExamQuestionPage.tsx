import { Grid, Typography } from '@mui/material';
import { Container } from 'atoms';
import { examProjectQuestionNewBreadcrumbsPage } from 'components/common/breadcrumbsList';
import QuestionForm from 'components/forms/QuestionForm';
import useFetch from 'hooks/use-fetch';

import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';

const NewExamQuestionPage = () => {
  const dispatch = useAppDispatch();
  const { examId } = useParams();
  const { data } = useFetch<any>(
    `${process.env.REACT_APP_API_URL}/api/v1/exams/${examId}`,
    null
  );

  useEffect(() => {
    dispatch(
      uiActions.ChangeBreadcrumb(examProjectQuestionNewBreadcrumbsPage(data))
    );
  }, [dispatch, data]);

  return (
    <Container size='large'>
      <Grid container>
        <Grid item width={'100%'}>
          <Typography variant='h4'>New Question</Typography>
        </Grid>
        <Grid item width={'100%'}>
          <QuestionForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewExamQuestionPage;
