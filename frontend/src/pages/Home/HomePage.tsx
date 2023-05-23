import { Box, Paper, TextField, Typography } from '@mui/material';
import { Container } from 'atoms';
import ExamCard from 'components/cards/ExamCard';
import Pagination from 'components/common/pagination';
import useFilter from 'hooks/use-filter';

const initFilter = {
  search: '',
  major: '',
  category: '',
};

const HomePage = () => {
  const {
    filter,
    page,
    maxPages,
    filterHandler,
    pageHandler,
    data: filteredExams,
    count,
    firstItem,
    lastItem,
  } = useFilter(initFilter, 'exams', [
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
    { name: '1', desc: '1' },
  ]);

  return (
    <Container size='medium'>
      <Paper elevation={4} sx={{ p: 4, my: 3 }}>
        <Box maxWidth={'100%'} width={500} mb={1}>
          <TextField
            placeholder='Search'
            fullWidth
            value={filter.search}
            onChange={(e: any) => filterHandler('search', e.target.value)}
            // icon={<SearchIcon fontSize='inherit' />}
            // width={isMobile ? '100%' : '28rem'}
          />
        </Box>
        <Typography fontSize={20} mb={1}>
          {firstItem} - {lastItem} from {count} results
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
          {filteredExams.map((course: any, index: number) => (
            <ExamCard key={index} {...course} />
          ))}
        </Box>
        <Pagination
          count={count}
          pageHandler={pageHandler}
          page={page}
          maxPages={maxPages}
        />
      </Paper>
    </Container>
  );
};

export default HomePage;
