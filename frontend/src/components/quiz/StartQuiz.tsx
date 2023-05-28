import { useTimer } from 'react-timer-hook';
import { Box, Grid, Button, Typography } from '@mui/material';

interface Props {
  name: string;
  duration: number;
  questionsCount: number;
  startQuizHandler: () => void;
}

const StartQuiz: React.FC<Props> = (props) => {
  let time = new Date();
  time.setMinutes(time.getMinutes() + props.duration);
  const { hours, minutes } = useTimer({
    autoStart: false,
    expiryTimestamp: time,
  });
  let timeMessage = '';
  if (hours) timeMessage = `${hours}:${minutes} hour${hours > 1 ? 's' : ''}`;
  else timeMessage = `${minutes} minutes`;
  return (
    <Box>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        height='100%'
        flexDirection='column'
        spacing={1}
      >
        <Grid item>
          <Typography>Welcome to {props.name}</Typography>
        </Grid>
        <Grid item>
          <Typography>it contains {props.questionsCount} questions</Typography>
        </Grid>
        <Grid item>
          <Typography>time limit: {timeMessage}</Typography>
        </Grid>
        <Grid item>
          <Button variant='contained' onClick={props.startQuizHandler}>
            Start Quiz
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StartQuiz;
