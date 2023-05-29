import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import 'index.css';
import Header from 'components/Header';
import Sidebar from 'components/sidebar/Sidebar';
import LoginPage from './login/LoginPage';
import HomePage from './Home/HomePage';

import { AuthContext } from 'store/auth-context';
import SignupPage from './signup/SignupPage';
import ExamPage from './exams/ExamPage';
import MyExamsPage from './my-exams/MyExamsPage';
import CertificatePage from './certificate/CertificatePage';
import ExamsProjectsPage from './company/exams-projects/ExamsProjectsPage';
import UsersPage from './company/users/UsersPage';
import EditUserPage from './company/users/EditUserPage';
import NewUsersPage from './company/users/NewUserPage';
import NewExamProjectPage from './company/exams-projects/NewExamProjectPage';
import EditExamProjectPage from './company/exams-projects/EditExamProjectPage';
import Breadcrumbs from 'components/common/Breadcrumbs';
import ExamQuestionsPage from './company/exams-projects/ExamQuestionsPage';
import ExamApplicantsPage from './company/exams-projects/ExamApplicantsPage';
import NewExamQuestionPage from './company/exams-projects/NewExamQuestionPage';
import EditExamQuestionPage from './company/exams-projects/EditExamQuestionPage';
import StartExamPage from './exams/StartExamPage';
import MyProfilePage from './my-profile/MyProfilePage';

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

  const sidebarFlag = pathname.startsWith('/company');

  // protect company
  useEffect(() => {
    if (pathname.startsWith('/company') && !policies?.examsGetall) {
      navigate('/', { replace: true });
    }
  }, [pathname, policies?.examsGetall, navigate]);

  useEffect(() => {
    if (
      (pathname.startsWith('/my-exams') ||
        pathname.startsWith('/certificate') ||
        pathname.startsWith('/exams/start')) &&
      !policies?.registerAll
    ) {
      navigate('/', { replace: true });
    }
  }, [pathname, policies?.registerAll, navigate]);

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
                    isMobile={isMobile}
                    openMobileDrawer={openMobileDrawer}
                    toggleMobileDrawerHandler={toggleMobileDrawerHandler}
                  />
                )}
                <Box>
                  {sidebarFlag && <Breadcrumbs />}
                  <Routes>
                    {/* {public pages} */}
                    <Route path='/' element={<HomePage />} />
                    <Route path='/signup' element={<SignupPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    {/* {company's exams projects} */}
                    <Route
                      path='/company/exams-projects'
                      element={<ExamsProjectsPage />}
                    />
                    <Route
                      path='/company/exams-projects/new'
                      element={<NewExamProjectPage />}
                    />
                    <Route
                      path='/company/exams-projects/:examId/new'
                      element={<EditExamProjectPage />}
                    />
                    <Route
                      path='/company/exams-projects/:examId/edit'
                      element={<EditExamProjectPage />}
                    />
                    <Route
                      path='/company/exams-projects/:examId/questions'
                      element={<ExamQuestionsPage />}
                    />{' '}
                    <Route
                      path='/company/exams-projects/:examId/questions/new'
                      element={<NewExamQuestionPage />}
                    />
                    <Route
                      path='/company/exams-projects/:examId/questions/:questionId/edit'
                      element={<EditExamQuestionPage />}
                    />
                    <Route
                      path='/company/exams-projects/:examId/applicants'
                      element={<ExamApplicantsPage />}
                    />
                    {/* {company's users pages} */}
                    <Route path='/company/users' element={<UsersPage />} />
                    <Route
                      path='/company/users/new'
                      element={<NewUsersPage />}
                    />
                    <Route
                      path='/company/users/:userId/edit'
                      element={<EditUserPage />}
                    />
                    {/* {student pages} */}
                    <Route
                      path='/certificate/:registerId'
                      element={<CertificatePage />}
                    />
                    <Route path='/my-exams' element={<MyExamsPage />} />
                    <Route path='/my-profile' element={<MyProfilePage />} />
                    <Route path='/exams/:examId' element={<ExamPage />} />
                    <Route
                      path='/exams/start/:examId'
                      element={<StartExamPage />}
                    />
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
