import { useState } from 'react';
import Box from '@mui/material/Box';

import { ArrowBackIcon, ArrowForwardIcon } from 'atoms/icons';
import { IconButton } from '@mui/material';

interface Props {
  page: number;
  maxPages: number;
  count: number;
  pageHandler: (type: 'dec' | 'inc') => void;
}

const Pagination: React.FC<Props> = (props) => {
  const [cooldown, setCooldown] = useState(false);
  const { page, maxPages, count, pageHandler } = props;
  const lastPage = Math.ceil(count / maxPages);

  const paginationHandler = (key: 'dec' | 'inc') => {
    if (!cooldown) {
      setCooldown(true);
      pageHandler(key);
      setTimeout(() => window.scrollTo(0, 0), 100);
      setTimeout(() => setCooldown(false), 400);
    }
  };

  return (
    <Box
      display='flex'
      alignItems='center'
      // flexDirection='row-reverse'
      mt='2rem'
    >
      <span>
        page {page} from {lastPage}
      </span>
      <IconButton onClick={() => paginationHandler('dec')} disabled={page <= 1}>
        <ArrowBackIcon fontSize='inherit' />
      </IconButton>
      <IconButton
        onClick={() => paginationHandler('inc')}
        disabled={page >= lastPage}
      >
        <ArrowForwardIcon fontSize='inherit' />
      </IconButton>
    </Box>
  );
};

export default Pagination;
