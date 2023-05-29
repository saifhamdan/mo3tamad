import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { Container, Link } from 'atoms';
import { QuizIcon, TimeIcon } from 'atoms/icons';
import useFetch from 'hooks/use-fetch';
import { useContext } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from 'store/auth-context';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';

const ExamPage = () => {
  const { policies } = useContext(AuthContext);
  const { examId } = useParams();
  const { data, loading, error } = useFetch<any>(
    `${process.env.REACT_APP_API_URL}/api/v1/exams/${examId}`,
    {}
  );
  return (
    <LoadingSpinnerWrapper loading={loading} error={error}>
      {data.id && (
        <div
          style={{
            backgroundColor: '#1c1d1f',
            minHeight: 400,
          }}
        >
          <Container
            style={{ padding: 16, paddingTop: 48, position: 'relative' }}
          >
            <Grid container justifyContent='space-between'>
              <Grid
                item
                sx={{ width: { xs: 'none', md: 'calc(100% - 350px)' } }}
              >
                <Typography mb={3} color='white' variant='h4'>
                  {data.name}
                </Typography>
                <Typography mb={3} color='white'>
                  {data.desc}
                </Typography>
                <Typography color='white'>
                  Created by
                  <Typography
                    ml={1}
                    color='primary'
                    fontWeight='bold'
                    component='span'
                  >
                    <Link to='' color='primary'>
                      {data.company.name}
                    </Link>
                  </Typography>
                </Typography>
              </Grid>
              <Grid position={'absolute'} right={16} item>
                <Paper elevation={6} style={{ width: 350, height: 500 }}>
                  <img
                    src={'https://picsum.photos/350/300'}
                    width={'350'}
                    height={'300'}
                    alt='exam cover'
                  />
                  <Grid
                    height={'200px'}
                    flexDirection={'column'}
                    container
                    p={2}
                  >
                    <Grid item flexGrow={1}>
                      <Typography mb={1} fontWeight='bold'>
                        General Information:
                      </Typography>

                      <Box mb={1} display='flex'>
                        <QuizIcon />
                        <Typography ml={1}>
                          {' '}
                          {data.questionsCount} Questions
                        </Typography>
                      </Box>
                      <Box display='flex'>
                        <TimeIcon />
                        <Typography ml={1}>{data.duration} Minutes</Typography>
                      </Box>
                    </Grid>

                    <Grid item>
                      <Button
                        disabled={!policies?.registerAll}
                        size='large'
                        fullWidth
                        variant='contained'
                      >
                        Register
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </div>
      )}
    </LoadingSpinnerWrapper>
  );
};

export default ExamPage;
