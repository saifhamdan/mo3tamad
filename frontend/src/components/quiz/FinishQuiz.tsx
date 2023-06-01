import { Box, Typography, Button } from '@mui/material';
import { Link } from 'atoms';

interface Props {}

const FinishQuiz: React.FC<Props> = (props) => {
  return (
    <Box mb={3}>
      <Box mb={1}>
        <Typography>
          You have finished the exam your applicant will be reviewed shortly
        </Typography>
      </Box>
      <Box>
        <Link to='/my-exams' decorated={false}>
          <Button variant='contained' style={{ marginRight: 8 }}>
            Back to My exams page
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default FinishQuiz;
