import { Box, Button, Grid } from '@mui/material';

interface Props {
  currentQuestion: number;
  questionsLength: number | undefined;
  finishQuizHandler: (() => void) | undefined;
  changeQuestionHandler: ((newQuestionIndex: number) => void) | undefined;
}

const QuestionActions: React.FC<Props> = (props) => {
  return (
    <Box>
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item>
          {props.currentQuestion !== 0 && (
            <Button
              variant='contained'
              onClick={() =>
                props.changeQuestionHandler &&
                props.changeQuestionHandler(props.currentQuestion - 1)
              }
            >
              Back
            </Button>
          )}
        </Grid>
        <Grid item>
          {props.currentQuestion + 1 !== props.questionsLength && (
            <Button
              variant='contained'
              onClick={() =>
                props.changeQuestionHandler &&
                props.changeQuestionHandler(props.currentQuestion + 1)
              }
            >
              Next
            </Button>
          )}
          {props.currentQuestion + 1 === props.questionsLength && (
            <Button variant='contained' onClick={props.finishQuizHandler}>
              Finish
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionActions;
