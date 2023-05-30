import styled from '@emotion/styled';
import { Grid, Box, Button, Typography } from '@mui/material';
import { Link } from 'atoms';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { headers } from 'services/auth';

export const ExamPaper = styled.div`
  max-width: 100%;
  padding: 0rem;
  display: block;
  box-shadow: 0px 2px 4px 2px #5555;
  /* cursor: alias; */
`;

const statusMapper: any = {
  'not-started': 'Not started',
  started: 'Started',
  passed: 'Passed',
  cheated: 'Cheated',
  'not-passed': 'Failed',
  'waiting-approval': 'Waiting approval',
};

const ExamCertificateCard: React.FC<any> = (props) => {
  const navigate = useNavigate();

  const startExamHandler = async () => {
    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/registration/${props.id}/start`,
        method: 'PATCH',
        headers,
      });
      navigate(`/exams/start/${props.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ExamPaper>
      <Grid
        display='inline-flex'
        height='100%'
        container
        flexDirection='column'
      >
        <span
          // className='course-card-a'
          style={{
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <img
            src={'https://picsum.photos/200/300'}
            alt={`${props.exam.name} thumbnail`}
            draggable={false}
            height={200}
            placeholder='blur'
            // blurDataURL='/blur/course-blur.webp'
            loading='eager'
            style={{
              width: '100%',
              borderTopLeftRadius: 'var(--border-radius)',
              borderTopRightRadius: 'var(--border-radius)',
            }}
          />
        </span>
        <Box p={1.5}>
          <Box mb={3} flexGrow={1}>
            <Typography mb={1} fontSize={22}>
              {props.exam.name}
            </Typography>
            <Typography>
              score:{' '}
              <Typography component='span' fontWeight='bold'>
                {props.score ? props.score : 0}%
              </Typography>
            </Typography>
            <Typography>
              status:{' '}
              <Typography component='span' fontWeight='bold'>
                {statusMapper[props.status]}
              </Typography>
            </Typography>
          </Box>
          <Box>
            {props.status === 'not-started' && (
              <Button variant='contained' onClick={startExamHandler}>
                Start
              </Button>
            )}
            {props.status === 'started' && (
              <Link to='/exams/start/:id'>
                <Button variant='contained'>Continue</Button>
              </Link>
            )}
            {props.status === 'passed' && (
              <Link to='/certificate/:id'>
                <Button variant='contained'>Get Certificate</Button>
              </Link>
            )}
            {(props.status === 'not-passed' ||
              props.status === 'waiting-approval' ||
              props.status === 'cheated') && (
              <Button variant='contained' disabled>
                Get Certificate
              </Button>
            )}
          </Box>
        </Box>
      </Grid>
    </ExamPaper>
  );
};
export default ExamCertificateCard;
