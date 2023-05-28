import { Box, Grid, Typography } from '@mui/material';
import styled from '@emotion/styled';

const QuestionNavigate = styled(Box)<{ boldBorder: boolean }>`
  display: inline-block;
  outline: ${(props) => (props.boldBorder ? 2.5 : 1)}px solid black;
  text-align: center;
  cursor: pointer;
`;

const NavigateNumber = styled(Box)`
  font-size: 14px;
  height: 20px;
`;

const NavigateColor = styled(Box)`
  height: 15px;
`;

const NavigateWrapper = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(2rem, 1rem));
  grid-gap: 8px;
`;

interface Props {
  questions: any[] | undefined;
  currentQuestion: number;
  duration?: string;
  showAnswers?: boolean | undefined;
  changeQuestionHandler: ((index: number) => void) | undefined;
}

const QuizNavigation: React.FC<Props> = (props) => {
  return (
    <Box bgcolor={'#2fbad915'} p={2}>
      <Box mb={1}>
        <Grid container justifyContent='space-between'>
          <Grid item>
            <Typography>Quiz Navigation</Typography>
          </Grid>
          {props.duration && (
            <Grid item>
              <Typography>{props.duration}</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
      <NavigateWrapper>
        {props.questions &&
          props.questions.map((qs, index) => {
            let color = qs.value || qs.values.length > 0 ? qs.isCorrect : null;

            return (
              <QuestionNavigate
                key={index}
                boldBorder={props.currentQuestion === index}
                onClick={() =>
                  props.changeQuestionHandler &&
                  props.changeQuestionHandler(index)
                }
              >
                <NavigateNumber>{index + 1}</NavigateNumber>
                <NavigateColor
                  bgcolor={color ? '#555' : undefined}
                ></NavigateColor>
              </QuestionNavigate>
            );
          })}
      </NavigateWrapper>
    </Box>
  );
};

export default QuizNavigation;
