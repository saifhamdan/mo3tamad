import styled from '@emotion/styled';
import { Grid, Box, Button, Typography } from '@mui/material';
import { Link } from 'atoms';

export const ExamPaper = styled.div`
  max-width: 100%;
  padding: 0rem;
  display: block;
  box-shadow: 0px 2px 4px 2px #5555;
  /* cursor: alias; */
`;

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
            src={'https://picsum.photos/200/300'}
            alt={`${props.name} thumbnail`}
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
              java certifcation exam
            </Typography>
            <Typography>
              score{' '}
              <Typography component='span' fontWeight='bold'>
                50%
              </Typography>
            </Typography>
            <Typography>
              status{' '}
              <Typography component='span' fontWeight='bold'>
                passed
              </Typography>
            </Typography>
          </Box>
          <Box>
            <Link to='/exam/start/:id'>
              <Button variant='contained'>Start</Button>
            </Link>
            <Link to='/certificate/:id'>
              <Button variant='contained'>Get Certificate</Button>
            </Link>
          </Box>
        </Box>
      </Grid>
    </ExamPaper>
  );
};
export default ExamCertificateCard;
