import { Paper, Typography } from '@mui/material';
import { Container } from 'atoms';
import QuizController from 'components/quiz/QuizController';
import { useEffect, useState } from 'react';

const StartExamPage = () => {
  const [isCheated, setIsCheated] = useState(false);
  const data = {
    name: 'quiz data',
    questions: [
      {
        desc: '12312',
        options: [],
      },
      {
        desc: '3123',
      },
    ],
  };

  useEffect(() => {
    if (!window.screenTop && !window.screenY) {
    } else {
      setIsCheated(true);
    }
  }, [window.screenTop, window.screenY]);

  return (
    <Container>
      <Paper elevation={4} sx={{ p: 4, my: 3 }}>
        <Typography variant='h4' mb={3}>
          {data.name}
        </Typography>
        <div>cheated? {isCheated ? 'true' : 'false'}</div>
        <QuizController quiz={data} />
      </Paper>
    </Container>
  );
};

export default StartExamPage;
