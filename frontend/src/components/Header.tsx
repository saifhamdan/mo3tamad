import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';

import { Link, MenuWrapper } from 'atoms';
import { PersonIcon, MenuIcon } from 'atoms/icons';
import { AuthContext } from 'store/auth-context';
import AccountMenu from './menus/AccountMenu';
import logoPath from 'assets/img/mo3tamad_logo.png';
import { Button } from '@mui/material';

const pages = [
  // {
  //   label: 'Home',
  //   path: '/',
  // },
  // {
  //   label: 'Assessments',
  //   path: 'assessments/view/working',
  // },
  // {
  //   label: 'Login',
  //   path: '/login',
  // },
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

interface Props {
  isMobile: boolean;
  toggleMobileDrawerHandler: () => void;
}

const Header = (props: Props) => {
  const { toggleMobileDrawerHandler } = props;
  const { isAuth } = useContext(AuthContext);

  return (
    <AppBar
      position='static'
      sx={{
        zIndex: 10,
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Link to='/' decorated={false}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <img
                src={logoPath}
                alt='mo3tamad'
                style={{
                  width: 200,
                  height: '100%',
                }}
              />
            </Box>
          </Link>
          {isAuth && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={toggleMobileDrawerHandler}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
          <Link
            to='/'
            decorated={false}
            style={{
              width: '100%',
            }}
          >
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <img
                src={logoPath}
                alt='mo3tamad'
                style={{
                  marginLeft: -10,
                  width: 200,
                  height: '100%',
                }}
              />
            </Box>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* {pages.map((page, i) => (
              <Link key={i} href={page.path} decorated={false}>
                <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page.label}
                </Button>
              </Link>
            ))} */}
          </Box>

          {!isAuth && (
            <>
              <Link to='/login' decorated={false}>
                <Button sx={{ mr: 1 }} color='info' variant='contained'>
                  login
                </Button>
              </Link>
              <Link to='/signup' decorated={false}>
                <Button color='info' variant='contained'>
                  signup
                </Button>
              </Link>
            </>
          )}

          {isAuth && (
            <MenuWrapper>
              {(props) => (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title='Account Settings'>
                    <IconButton
                      size='large'
                      color='inherit'
                      onClick={props.onOpen}
                    >
                      <PersonIcon />
                    </IconButton>
                  </Tooltip>
                  <AccountMenu
                    open={props.open}
                    anchorEl={props.anchorEl}
                    closeHandler={props.onClose}
                  />
                </Box>
              )}
            </MenuWrapper>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
