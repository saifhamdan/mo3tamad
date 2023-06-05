import styled from '@emotion/styled';
import { Grid, Box, Button, Typography, Chip } from '@mui/material';
import { Link } from 'atoms';

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
            src={`${process.env.REACT_APP_API_URL}/thumbnails/${props.exam.thumbnailUrl}`}
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
                {props.result && props.isConsidered ? props.result : 0}%
              </Typography>
            </Typography>
            <Typography>
              status:{' '}
              <Typography component='span' fontWeight='bold'>
                {statusMapper[props.status]}
              </Typography>
            </Typography>
            {props.exam.categories && (
              <Box my={1}>
                {props.exam.categories.map((c: any) => (
                  <Chip key={c.id} label={c.desc} sx={{ mr: 0.5 }} />
                ))}
              </Box>
            )}
            {props.exam.level && (
              <Typography color='gray'>
                level: {props.exam.level.desc}
              </Typography>
            )}
          </Box>
          <Box>
            {props.status === 'not-started' && (
              <Link to={`/exams/start/${props.id}`}>
                <Button variant='contained'>Start</Button>
              </Link>
            )}
            {props.status === 'started' && (
              <Link to={`/exams/start/${props.id}`}>
                <Button variant='contained'>Continue</Button>
              </Link>
            )}
            {props.status === 'passed' && (
              <Link to={`/certificate/${props.exam.id}`}>
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
