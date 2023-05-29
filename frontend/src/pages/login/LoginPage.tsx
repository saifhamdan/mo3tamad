import { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Link } from 'atoms';
import { EmailIcon, LockIcon } from 'atoms/icons';
import { AuthContext } from 'store/auth-context';
import logoPath from 'assets/img/mo3tamad_logo.png';

// intial Form Values
const initialValues = {
  email: '',
  password: '',
  axiosError: '',
};

// Validation Schema
const sectionValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('must be a valid email')
    .required('email field is required'),
  password: Yup.string().required('password field is required'),
});

const LoginPage = () => {
  const { loginHandler } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: sectionValidationSchema,
    onSubmit: async (values, formik) => {
      setLoading(true);
      try {
        await loginHandler(values.email, values.password);
      } catch (err: any) {
        const error: ErrorResponse = err.response.data;
        formik.setFieldError('axiosError', error.message);
      }
      setLoading(false);
    },
  });

  return (
    <Grid
      container
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100vh'}
    >
      <Paper>
        <Box width={400} p={2}>
          <Box mb={2} px={2} textAlign={'center'}>
            <img src={logoPath} alt='mo3tamad logo' width={200} />
          </Box>
          <Box mb={3}>
            <Divider />
          </Box>
          <Box px={2}>
            <form onSubmit={formik.handleSubmit}>
              <Box mb={2}>
                <TextField
                  autoComplete='username email'
                  autoFocus
                  placeholder={'Email'}
                  fullWidth
                  type='email'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  name='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && !!formik.errors.email}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  autoComplete='new-password'
                  placeholder={'Password'}
                  type='password'
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  name='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && !!formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Box>
              <Box mb={2}>
                <FormHelperText error={!!formik.errors.axiosError}>
                  {formik.errors.axiosError}
                </FormHelperText>
              </Box>
              <Box mb={2}>
                <LoadingButton
                  type='submit'
                  variant='contained'
                  loading={loading}
                  fullWidth
                  size='large'
                >
                  {'sign in'}
                </LoadingButton>
              </Box>
            </form>
            <Box mb={2}>
              <Typography textAlign='center' variant='body2'>
                <span>
                  don't have account?{' '}
                  <Link to={'/signup'}>{'Create account'}</Link>
                </span>
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography textAlign='center' variant='body2'>
                <span>
                  <Link to={'/forgot-password'}>{'Forgot Password?'}</Link>
                </span>
              </Typography>
            </Box>
            <Box mb={3}>
              <Divider />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default LoginPage;
