import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import 'index.css';
import Header from 'components/Header';
import Sidebar from 'components/sidebar/Sidebar';
import LoginPage from './login/LoginPage';
import HomePage from './Home/HomePage';
import Breadcrumbs from 'components/common/Breadcrumbs';

import { AuthContext } from 'store/auth-context';
import DasboardPage from './admin/dashboard/DashboardPage';
import SignupPage from './signup/SignupPage';

const Index: React.FC<{}> = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuth, policies } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const toggleMobileDrawerHandler = () => {
    setOpenMobileDrawer(!openMobileDrawer);
  };

  const clientSidebar = pathname?.startsWith('/assessments');
  const adminSidebar = pathname?.startsWith('/admin');
  const sidebarFlag = clientSidebar || adminSidebar;

  // temp
  useEffect(() => {
    if (
      isAuth !== null &&
      pathname.startsWith('/admin') &&
      !policies?.adminAll
    ) {
      navigate('/', { replace: true });
    }
  }, [policies?.adminAll, pathname]);

  return (
    <div>
      <>
        <Grid container direction={'column'} minHeight={'100vh'}>
          <Header
            isMobile={isMobile}
            toggleMobileDrawerHandler={toggleMobileDrawerHandler}
          />

          <Grid
            item
            flexGrow={1}
            style={{
              flexGrow: 1,
              height: '90vh',
              //overflowY: 'auto',
              overflowY: 'auto',
              width: '100%',
              position: 'relative',
            }}
          >
            <Grid container>
              {sidebarFlag && (
                <Grid
                  item
                  sx={{
                    display: { xs: 'none', md: 'inline-block' },
                    width: '240px',
                    height: '100%',
                    overflowY: 'auto',
                    zIndex: -1000,
                  }}
                />
              )}
              <Grid
                item
                sx={{
                  width: {
                    xs: '100%',
                    md: sidebarFlag ? 'calc(100% - 240px)' : '100%',
                  },
                }}
              >
                {sidebarFlag && (
                  <Sidebar
                    admin={adminSidebar}
                    client={clientSidebar}
                    isMobile={isMobile}
                    openMobileDrawer={openMobileDrawer}
                    toggleMobileDrawerHandler={toggleMobileDrawerHandler}
                  />
                )}
                <Box p={sidebarFlag ? 3 : 0}>
                  <Breadcrumbs />
                  <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/signup' element={<SignupPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/admin/dashboard' element={<DasboardPage />} />
                  </Routes>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    </div>
  );
};

export default Index;
