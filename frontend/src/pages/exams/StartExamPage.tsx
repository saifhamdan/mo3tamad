import { Paper, Typography } from '@mui/material';
import { Container } from 'atoms';
import QuizController from 'components/quiz/QuizController';
import useFetch from 'hooks/use-fetch';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';

const StartExamPage = () => {
  const { registerId } = useParams();
  const { data, loading, error } = useFetch<any>(
    `${process.env.REACT_APP_API_URL}/api/v1/registration/${registerId}`,
    {}
  );

  return (
    <Container>
      <Paper elevation={4} sx={{ p: 2, my: 3 }}>
        <LoadingSpinnerWrapper loading={loading} error={error}>
          {data.id && <QuizController quiz={data} />}
        </LoadingSpinnerWrapper>
      </Paper>
    </Container>
  );
};

export default StartExamPage;
