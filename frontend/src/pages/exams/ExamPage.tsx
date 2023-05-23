import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { Container, Link } from 'atoms';
import { QuizIcon, TimeIcon } from 'atoms/icons';

const ExamPage = () => {
  return (
    <div
      style={{
        backgroundColor: '#1c1d1f',
        minHeight: 400,
      }}
    >
      <Container style={{ padding: 16, paddingTop: 48, position: 'relative' }}>
        <Grid container justifyContent='space-between'>
          <Grid item sx={{ width: { xs: 'none', md: 'calc(100% - 350px)' } }}>
            <Typography mb={3} color='white' variant='h4'>
              Learn How To Code: Google's Go (golang) Programming Language
            </Typography>
            <Typography mb={3} color='white'>
              The Ultimate Comprehensive Course - Perfect for Both Beginners and
              Experienced Developers
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
                  Oracle
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
              <Grid height={'200px'} flexDirection={'column'} container p={2}>
                <Grid item flexGrow={1}>
                  <Typography mb={1} fontWeight='bold'>
                    General Information:
                  </Typography>

                  <Box mb={1} display='flex'>
                    <QuizIcon />
                    <Typography ml={1}>30 Questions</Typography>
                  </Box>
                  <Box display='flex'>
                    <TimeIcon />
                    <Typography ml={1}>1 Hour</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Button size='large' fullWidth variant='contained'>
                    Register
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ExamPage;
