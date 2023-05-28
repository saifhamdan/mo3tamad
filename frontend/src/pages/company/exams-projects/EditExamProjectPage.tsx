import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import useFetch from 'hooks/use-fetch';
import { companyId } from 'services/auth';
import { Container } from 'atoms';
import { useAppDispatch } from 'store';
import { useEffect } from 'react';
import { uiActions } from 'store/ui-slice';
import { editExamProjectResultsBreadcrumbsPage } from 'components/common/breadcrumbsList';
import ExamProjectForm from 'components/forms/ExamProjectForm';

const EditExamProjectPage = () => {
  const dispatch = useAppDispatch();
  const { examId } = useParams();
  const { data, loading, error } = useFetch<User>(
    `${process.env.REACT_APP_API_URL}/api/v1/exams/${examId}`,
    null
  );

  useEffect(() => {
    if (data) {
      dispatch(
        uiActions.ChangeBreadcrumb(editExamProjectResultsBreadcrumbsPage(data))
      );
    }
  }, [dispatch, data]);

  return (
    <Container size='large'>
      <Grid container>
        <Grid item width={'100%'}>
          <Typography variant='h4'>Edit Exam Project</Typography>
        </Grid>
        <Grid item width={'100%'}>
          <LoadingSpinnerWrapper loading={loading} error={error}>
            {data && <ExamProjectForm data={data} id={examId} />}
          </LoadingSpinnerWrapper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditExamProjectPage;
