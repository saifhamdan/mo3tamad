import { Typography, Button, Grid } from '@mui/material';
import { Link } from 'atoms';
import { useContext } from 'react';
import { AuthContext } from 'store/auth-context';

const HomePage = () => {
  const { policies } = useContext(AuthContext);
  return (
    <Grid
      container
      height={'80vh'}
      textAlign='center'
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Typography variant='h3' mb={1}>
        Home Page
      </Typography>
      <Grid justifyContent={'space-between'} gap={2}>
        <Link to='/assessments/working' decorated={false}>
          <Button>Assessments</Button>
        </Link>
        {policies?.adminAll && (
          <Link to='/admin/dashboard' decorated={false}>
            <Button>Admin</Button>
          </Link>
        )}
        <Link to='/login' decorated={false}>
          <Button>Login</Button>
        </Link>
      </Grid>
    </Grid>
  );
};

export default HomePage;
