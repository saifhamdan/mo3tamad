import { Box, Grid, Typography } from '@mui/material';
import styled from '@emotion/styled';

import QuestionActions from './QuestionActions';
import QuizNavigation from '../QuizNavigation';
import Options from './Options';

const QuestionNumberBox = styled(Box)`
  border: 1px solid black;
`;

interface Props {
  courseName: string;
  trans: any;
  currentQuestion: number;
  duration?: string;
  questions?: any[];
  matches: boolean;
  index?: number;
  finishQuizHandler?: () => void | undefined;
  changeQuestionHandler?: (index: number) => void | undefined;
  answerHandler?: (opId: string) => Promise<void> | undefined;
}

const Question: React.FC<Props> = (props) => {
  const questionsLength = props.questions?.length;

  return (
    <Grid container justifyContent='space-between' alignItems='flex-start'>
      <Grid
        item
        width={!props.matches ? 'calc(100% - 320px)' : '100%'}
        flexGrow={1}
      >
        <Grid container>
          <Grid
            item
            mr={!props.matches ? 2 : 0}
            width={!props.matches ? 'fit-content' : '100%'}
            mb={1}
          >
            <QuestionNumberBox bgcolor={'lightgray'} p={1}>
              <Typography component='span' variant='subtitle1'>
                Question{' '}
                <Typography component='span' fontWeight={500} fontSize={17}>
                  {props.currentQuestion + 1}
                </Typography>
              </Typography>
              <Typography component='div' variant='subtitle1'>
                {props.duration}
              </Typography>
            </QuestionNumberBox>
          </Grid>
          <Grid item flexGrow={1}>
            <Box>
              <Box bgcolor={'#faecdf'} p={2} mb={2}>
                <Box mb={1}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: props.trans.question.text,
                    }}
                  />
                </Box>
                <Box mb={3}></Box>
                <Box pl={1}>
                  {/* {props.transquestion.answerCount <= 1 && ( */}
                  <Options
                    options={props.trans.question.options}
                    answerId={props.trans.answerId}
                    answerHandler={props.answerHandler}
                  />
                  {/* )} */}
                </Box>
              </Box>

              <Box>
                <QuestionActions
                  currentQuestion={props.currentQuestion}
                  questionsLength={questionsLength}
                  finishQuizHandler={props.finishQuizHandler}
                  changeQuestionHandler={props.changeQuestionHandler}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      {!props.matches && (
        <Grid item width={300} ml={2}>
          <Box mb={3}>
            <QuizNavigation
              duration={props.duration}
              questions={props.questions}
              currentQuestion={props.currentQuestion}
              changeQuestionHandler={props.changeQuestionHandler}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default Question;
