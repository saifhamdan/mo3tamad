import { useTimer } from 'react-timer-hook';
import { Box, Grid, Button, Typography } from '@mui/material';

interface Props {
  name: string;
  status: string;
  duration: number;
  isFullScreen: boolean;
  questionsCount: number;
  startQuizHandler: () => void;
  continueQuizHandler: () => void;
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
        textAlign='center'
        spacing={1}
      >
        <Grid item>
          <Typography>Welcome to {props.name}</Typography>
        </Grid>
        <Grid item>
          <Typography>it contains {props.questionsCount} questions</Typography>
        </Grid>
        <Grid item>
          {props.status === 'not-started' && (
            <Typography>time limit: {timeMessage}</Typography>
          )}
          {props.status === 'started' && (
            <Typography>{props.duration}</Typography>
          )}
        </Grid>
        <Grid item>
          {props.status === 'not-started' && (
            <Button
              disabled={!props.isFullScreen}
              variant='contained'
              onClick={props.startQuizHandler}
            >
              Start Exam
            </Button>
          )}
          {props.status === 'started' && (
            <Button
              disabled={!props.isFullScreen}
              variant='contained'
              onClick={props.continueQuizHandler}
            >
              Continue Exam
            </Button>
          )}
          {!props.isFullScreen && (
            <Typography color='error'>
              make sure you are on fullscreen mode otherwise it will be
              considered cheating.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StartQuiz;
