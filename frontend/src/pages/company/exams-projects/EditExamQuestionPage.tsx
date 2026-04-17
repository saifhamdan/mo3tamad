import { Grid, Typography } from '@mui/material';
import { Container } from 'atoms';
import { examProjectQuestionEditBreadcrumbsPage } from 'components/common/breadcrumbsList';
import QuestionForm from 'components/forms/QuestionForm';
import useFetch from 'hooks/use-fetch';

import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';

const EditExamQuestionPage = () => {
  const dispatch = useAppDispatch();
  const { questionId } = useParams();
  const { data, loading, error } = useFetch<any>(
    `${process.env.REACT_APP_API_URL}/api/v1/questions/${questionId}`,
    null
  );

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
          <LoadingSpinnerWrapper loading={loading} error={error}>
            {data && <QuestionForm data={data} id={questionId} />}
          </LoadingSpinnerWrapper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditExamQuestionPage;
