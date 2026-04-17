import { Box, Paper, Typography } from '@mui/material';
import { Container } from 'atoms';
import ExamCertificateCard from 'components/cards/ExamCertificateCard';
import useFetch from 'hooks/use-fetch';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';

const MyExamsPage = () => {
  const { data, loading, error } = useFetch<any>(
    `${process.env.REACT_APP_API_URL}/api/v1/registration/my-exams`,
    []
  );
  return (
    <Container size='medium' style={{ height: 'max-content' }}>
      <Paper elevation={4} sx={{ p: 4, my: 3 }}>
        <Typography variant='h4' mb={3}>
          My exams
        </Typography>
        <LoadingSpinnerWrapper error={error} loading={loading}>
          <Box
            display='grid'
            sx={{
              gridTemplateColumns: {
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
                xs: 'auto',
              },
              gap: '25px',
            }}
          >
            {data &&
              data.map((reg: any, index: number) => (
                <ExamCertificateCard key={index} {...reg} />
              ))}
          </Box>
        </LoadingSpinnerWrapper>
      </Paper>
    </Container>
  );
};

export default MyExamsPage;
