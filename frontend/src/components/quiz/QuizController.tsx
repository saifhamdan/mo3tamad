import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { Box, Typography, useMediaQuery } from '@mui/material';

import QuizNavigation from './QuizNavigation';
import FinishQuiz from './FinishQuiz';
import StartQuiz from './StartQuiz';
import Question from './questions/Question';

const questionsMapper = (questions: any[]): any[] => {
  return questions.map((qs) => ({
    ...qs,
    value: '',
    values: [],
    isCorrect: 'grey',
  }));
};

const getTime = (duration: number) => {
  let time = new Date();
  time.setMinutes(time.getMinutes() + duration);
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
  const [quizStatus, setQuizStatus] = useState('');
  const [currQuestion, setCurrQuestion] = useState(0);
  const [grade, setGrade] = useState(0);
  const [questions, setQuestions] = useState(questionsMapper(quiz.questions));
  const matches = useMediaQuery('(max-width: 1150px)');

  const startQuizHandler = () => {
    if (questions.length > 0) {
      restart(getTime(quiz.duration));
      setCurrQuestion(0);
      setQuestions(questionsMapper(quiz.questions));
      setGrade(0);
      setQuizStatus('start');
    }
  };

  const finishQuizHandler = () => {
    const newQuestions = [...questions];
    let calcGrade = 0;
    questions.forEach((qs, qsIndex) => {
      if (qs.value) {
        qs.options.forEach((op: any) => {
          if (op.isAnswer) {
            if (op._id === qs.value) {
              ++calcGrade;
              newQuestions[qsIndex].isCorrect = 'green';
            } else newQuestions[qsIndex].isCorrect = 'red';
          }
        });
      } else if (qs.values.length > 0) {
        let qsGrade = 0;
        qs.options.forEach((op: any) => {
          if (qs.values.includes(op._id)) {
            if (op.isAnswer) {
              qsGrade += 1 / qs.answerCount;
              if (newQuestions[qsIndex].isCorrect !== 'grey')
                newQuestions[qsIndex].isCorrect = 'green';
              else newQuestions[qsIndex].isCorrect = 'yellow';
            } else {
              qsGrade -= 1 / qs.answerCount;
              if (newQuestions[qsIndex].isCorrect === 'grey')
                newQuestions[qsIndex].isCorrect = 'red';
              else newQuestions[qsIndex].isCorrect = 'yellow';
            }
          }
        });
        calcGrade += qsGrade > 0 ? qsGrade : 0;
      }
    });
    pause();
    setCurrQuestion(0);
    setQuestions(newQuestions);
    setGrade(calcGrade);
    setQuizStatus('finish');
  };

  const showQuizAnswersHandler = () => {
    if (quizStatus === 'finish') setQuizStatus('show');
    else if (quizStatus === 'show') setQuizStatus('finish');
  };

  const changeQuestionHandler = (index: number) => {
    setCurrQuestion(index);
    const qs = document.getElementById(`question-${index - 1}`);
    if (qs) qs.scrollIntoView();
  };

  const answerHandler = (ans: any) => {
    const newAnswers = [...questions];

    if (newAnswers[currQuestion].answerCount <= 1)
      newAnswers[currQuestion].value = ans;
    else newAnswers[currQuestion].values = ans;
    setQuestions(newAnswers);
  };

  const { hours, minutes, seconds, restart, pause } = useTimer({
    autoStart: false,
    expiryTimestamp: getTime(quiz.duration),
    onExpire: finishQuizHandler,
  });
  const duration = nicerDuration(hours, minutes, seconds);

  const questionsLength = questions.length;
  return (
    <Box height='100%' id='quiz'>
      <Box mb={3}>
        <Typography>{quiz.name}</Typography>
      </Box>
      {(quizStatus === 'show' || (quizStatus === 'start' && matches)) && (
        <Box mb={3} width='100%'>
          <QuizNavigation
            duration={quizStatus === 'start' ? duration : undefined}
            questions={questions}
            currentQuestion={currQuestion}
            showAnswers={quizStatus === 'show'}
            changeQuestionHandler={changeQuestionHandler}
          />
        </Box>
      )}
      {quizStatus === '' && (
        <StartQuiz
          name={quiz.name}
          duration={quiz.duration}
          questionsCount={questionsLength}
          startQuizHandler={startQuizHandler}
        />
      )}
      {quizStatus === 'start' && (
        <Question
          matches={matches}
          duration={duration}
          questions={questions}
          courseName={quiz.course.slug}
          currentQuestion={currQuestion}
          question={questions[currQuestion]}
          answerHandler={answerHandler}
          finishQuizHandler={finishQuizHandler}
          changeQuestionHandler={changeQuestionHandler}
        />
      )}
      {(quizStatus === 'finish' || quizStatus === 'show') && (
        <FinishQuiz
          currectAnswers={grade}
          questionsLength={questionsLength}
          resetQuizHandler={startQuizHandler}
          showQuizAnswersHandler={showQuizAnswersHandler}
        />
      )}
      {quizStatus === 'show' &&
        questions.map((qs, index) => (
          <Box id={`question-${index}`} key={index} mb={2}>
            <Question
              showAnswers
              index={index}
              question={qs}
              matches={matches}
              courseName={quiz.course.slug}
              currentQuestion={currQuestion}
            />
          </Box>
        ))}
    </Box>
  );
};

export default QuizController;
