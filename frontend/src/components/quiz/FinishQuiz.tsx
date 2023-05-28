import { Box, Typography, Button } from '@mui/material';

interface Props {
  currectAnswers: number;
  questionsLength: number;
  resetQuizHandler: () => void;
  showQuizAnswersHandler: () => void;
}

const FinishQuiz: React.FC<Props> = (props) => {
  return (
    <Box mb={3}>
      <Box mb={1}>
        <Typography>
          Grade: <strong>{props.currectAnswers}</strong> out{' '}
          {props.questionsLength} (
          <strong>
            {((props.currectAnswers / props.questionsLength) * 100).toFixed(2)}
          </strong>
          %)
        </Typography>
      </Box>
      <Box>
        <Button
          variant='contained'
          onClick={props.resetQuizHandler}
          style={{ marginRight: 8 }}
        >
          Reset Quiz
        </Button>
      </Box>
    </Box>
  );
};

export default FinishQuiz;
