import { Box, Paper, Typography } from '@mui/material';
import { Container } from 'atoms';
import ExamCertificateCard from 'components/cards/ExamCertificateCard';

const MyExamsPage = () => {
  const data = [1, 2, 3];
  return (
    <Container size='medium' style={{ height: 'max-content' }}>
      <Paper elevation={4} sx={{ p: 4, my: 3 }}>
        <Typography variant='h4' mb={3}>
          My exams
        </Typography>
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
          {data.map((course: any, index: number) => (
            <ExamCertificateCard key={index} {...course} />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default MyExamsPage;
