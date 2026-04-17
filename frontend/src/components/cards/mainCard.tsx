import { useState } from 'react';
import {
  Box,
  Button,
  CardContent,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import { Link } from 'atoms';

const MainCard: React.FC = () => {
  return (
    <Box
      sx={{
        height: 'fit-content',
        display: 'flex',
        borderBottom: 1,
        pb: 2,
        mb: 2,
        borderColor: 'divider',
      }}
    >
      <Box mr={3} maxWidth='300px'>
        <Link to='/'>
          <img
            width='auto'
            height={'150'}
            alt='product'
            src={''}
            draggable={false}
          />
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <CardContent sx={{ p: 0 }}>
          <Grid container>
            <Grid item flexGrow={1}>
              <Link to='/'>
                <Typography fontSize={17} fontWeight={500}>
                  Java Spring certifcation Exam
                </Typography>
              </Link>
              <Typography color='text.secondary' fontSize={15}>
                lorum lorum lorum lorum lorum lorum lorum lorum
              </Typography>
              <Typography color='text.secondary' fontSize={15}>
                {/* {t('card-by') + ' '} */}
                <Typography
                  component='span'
                  color='primary'
                  fontSize={15}
                  fontWeight={500}
                >
                  {/* {t('card-by-demo') + ' '} */}
                </Typography>
              </Typography>
              <Typography color='text.secondary' fontSize={15}>
                {/* {t('card-category') + ' '} */}
                <Typography
                  component='span'
                  color='primary'
                  fontSize={15}
                  fontWeight={500}
                >
                  {/* {t('card-category-demo') + ' '} */}
                </Typography>
              </Typography>
              <Typography fontSize={17} display={'flex'} color='green'>
                {/* {t('card-in-stock')} */}
              </Typography>
            </Grid>
            <Grid item>
              <Typography fontSize={17} fontWeight={500}>
                JD 14.00
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Grid container justifyContent='flex-end' spacing={1}>
          {/* <Grid item>
            <IconButton onClick={() => setFav((prev) => !prev)}>
              {fav ? (
                <FilledFavorite color='primary' />
              ) : (
                <OutlinedFavourite color='primary' />
              )}
            </IconButton>
          </Grid> */}
          <Grid item>
            <Button variant='contained'> Get Certifcate</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MainCard;
