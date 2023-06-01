import { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { Box, Typography, useMediaQuery } from '@mui/material';

import QuizNavigation from './QuizNavigation';
import FinishQuiz from './FinishQuiz';
import StartQuiz from './StartQuiz';
import Question from './questions/Question';
import axios from 'axios';
import { headers } from 'services/auth';
import { useParams } from 'react-router';
import CheatModal from 'components/modals/CheatModal';
import ConfirmationModal from 'components/modals/ConfirmationModal';

const getTime = (duration: string) => {
  let time = new Date(duration);

  return time;
};

const nicerDuration = (hours: number, minutes: number, seconds: number) => {
  const nicerNumber = (num: number) => {
    return num >= 10 ? num : num ? '0' + num : '00';
  };
  let string = 'Time Left: ';
  if (hours) string += `${nicerNumber(hours)}:`;
  string += `${nicerNumber(minutes)}:`;
  string += `${nicerNumber(seconds)}`;
  return string;
};

const QuizController: React.FC<{ quiz: any }> = ({ quiz }) => {
  const { registerId } = useParams();
  const [isFullScreen, setIsFullScreen] = useState(
    !(!window.screenTop && !window.screenY)
  );
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmStart, setConfirmStart] = useState(false);
  const [quizStatus, setQuizStatus] = useState('');
  const [currQuestion, setCurrQuestion] = useState(0);
  const [trans, setTrans] = useState(quiz.trans);
  const matches = useMediaQuery('(max-width: 1150px)');

  const handleResize = () => {
    if (!window.screenTop && !window.screenY) {
      setIsFullScreen(false);
    } else {
      setIsFullScreen(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const continueQuizHandler = () => {
    if (trans.length > 0) {
      setCurrQuestion(0);
      setQuizStatus('start');
    }
  };

  const startQuizHandler = async () => {
    try {
      const res = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/registration/${registerId}/start`,
        method: 'PATCH',
        headers,
      });
      if (trans.length > 0) {
        restart(getTime(res.data.data.endTime));
        setCurrQuestion(0);
        setQuizStatus('start');
      }
    } catch (err) {
      // alert(err);
    }
  };

  const finishQuizHandler = async () => {
    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/registration/${registerId}/finish`,
        method: 'PATCH',
        headers,
      });
      pause();
      setCurrQuestion(0);
      setQuizStatus('finish');
    } catch (err) {
      // alert(err);
    }
  };

  const changeQuestionHandler = (index: number) => {
    setCurrQuestion(index);
  };

  const answerHandler = async (ans: any) => {
    try {
      const newAnswers = [...trans];

      newAnswers[currQuestion].answerId = ans;
      setTrans(newAnswers);
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/trans/${newAnswers[currQuestion].id}/answer?answerId=${ans}`,
        method: 'Post',
        headers,
      });
    } catch (err) {
      // alert(err);
    }
  };

  const { hours, minutes, seconds, restart, pause } = useTimer({
    autoStart: quiz.status === 'started',
    expiryTimestamp: getTime(quiz.endTime),
    onExpire: finishQuizHandler,
  });

  const duration = nicerDuration(hours, minutes, seconds);
  console.log(isFullScreen);
  const transLength = trans.length;
  return (
    <Box height='100%' id='quiz'>
      <Box
        sx={{
          backgroundColor: '#e77917',
          p: 2,
          borderRadius: 1,
        }}
        mb={3}
      >
        <Typography variant='h5'>{quiz.exam.name}</Typography>
      </Box>
      {quizStatus === 'start' && matches && (
        <Box mb={3} width='100%'>
          <QuizNavigation
            duration={quizStatus === 'start' ? duration : undefined}
            questions={trans}
            currentQuestion={currQuestion}
            changeQuestionHandler={changeQuestionHandler}
          />
        </Box>
      )}
      {quizStatus === '' && (
        <StartQuiz
          status={quiz.status}
          name={quiz.exam.name}
          duration={
            quiz.status === 'not-started' ? quiz.exam.duration : duration
          }
          isFullScreen={isFullScreen}
          questionsCount={transLength}
          startQuizHandler={() => setConfirmStart(true)}
          continueQuizHandler={continueQuizHandler}
        />
      )}
      {quizStatus === 'start' && (
        <Question
          matches={matches}
          duration={duration}
          questions={trans}
          courseName={quiz.exam.name}
          currentQuestion={currQuestion}
          trans={trans[currQuestion]}
          answerHandler={answerHandler}
          finishQuizHandler={() => setConfirmFinish(true)}
          changeQuestionHandler={changeQuestionHandler}
        />
      )}
      {!isFullScreen && quizStatus && (
        <CheatModal
          open
          registerId={quiz.id}
          closeHandler={() => setIsFullScreen(false)}
        />
      )}
      <ConfirmationModal
        open={confirmFinish}
        actionHandler={finishQuizHandler}
        headerText='Confirm Finish'
        cancelButtonText='cancel'
        confirmButtonText='finish'
        closeHandler={() => setConfirmFinish(false)}
        bodyText='are you sure you want to finish exam?'
      />
      <ConfirmationModal
        open={confirmStart}
        actionHandler={startQuizHandler}
        headerText='Confirm Start'
        cancelButtonText='cancel'
        confirmButtonText='start'
        closeHandler={() => setConfirmStart(false)}
        bodyText='are you sure you want to start the exam now?'
      />
      {quizStatus === 'finish' && <FinishQuiz />}
    </Box>
  );
};

export default QuizController;
