import React, { useContext, useState } from 'react';

import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Grid, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { headers } from 'services/auth';
import { AuthContext } from 'store/auth-context';

// intial Form Values
const initialValues = {
  name: '',
  desc: '',
  mobile: '',
  axiosError: '',
};

const initialUserValues = {
  name: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  axiosError: '',
};

// Validation Schema
const companyValidationSchema = Yup.object().shape({
  name: Yup.string().required("company's name is required"),
  desc: Yup.string().required("company's description is required"),
  mobile: Yup.string().required("company's mobile is required "),
});
const userValidationSchema = Yup.object().shape({
  name: Yup.string().required("user's name is required"),
  email: Yup.string()
    .email('must be a valid email')
    .required("user's email is required"),
  mobile: Yup.string(),
  password: Yup.string()
    .min(3, 'password should at least contain 3 characters')
    .max(26, 'password should not contain more than 26 character')
    .required('user must has a password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('user must has a password'),
});

const mt = 3;
const CompanyForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState(0);
  const { loginHandler } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: companyValidationSchema,
    onSubmit: async (values, state) => {
      setSteps(1);
    },
  });

  const formikUser = useFormik({
    initialValues: initialUserValues,
    validationSchema: userValidationSchema,
    onSubmit: async (values, state) => {
      setLoading(true);
      try {
        const data = {
          company: {
            name: formik.values.name,
            desc: formik.values.desc,
            phoneNumber: formik.values.mobile,
          },
          account: {
            name: values.name,
            email: values.email,
            mobile: values.mobile,
            password: values.password,
          },
        };
        await axios({
          url: `${process.env.REACT_APP_API_URL}/auth/oauth/signup/company`,
          headers,
          method: 'POST',
          data,
        });
        await loginHandler(values.email, values.password);
      } catch (err: any) {
        state.setFieldError('axiosError', err?.message);
      }
      setLoading(false);
    },
  });

  return (
    <div>
      {steps === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <Grid item mt={mt} flexGrow={1} maxWidth={500}>
            <TextField
              variant='outlined'
              label='company name'
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
              required
            />
          </Grid>
          <Grid item mt={mt} flexGrow={1} maxWidth={500}>
            <TextField
              variant='outlined'
              label='company description'
              name='desc'
              value={formik.values.desc}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.desc && !!formik.errors.desc}
              helperText={formik.touched.desc && formik.errors.desc}
              fullWidth
              required
            />
          </Grid>
          <Grid item mt={mt} flexGrow={1} maxWidth={500}>
            <TextField
              variant='outlined'
              label='company mobile'
              name='mobile'
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobile && !!formik.errors.mobile}
              helperText={formik.touched.mobile && formik.errors.mobile}
              fullWidth
              required
            />
          </Grid>
          <Grid mt={mt} item width={'100%'}>
            <Button variant='contained' size='large' type='submit'>
              Continue
            </Button>
          </Grid>
        </form>
      )}
      {steps === 1 && (
        <form onSubmit={formikUser.handleSubmit}>
          <Grid item mt={mt} flexGrow={1} maxWidth={500}>
            <TextField
              variant='outlined'
              label='name'
              name='name'
              value={formikUser.values.name}
              onChange={formikUser.handleChange}
              onBlur={formikUser.handleBlur}
              error={formikUser.touched.name && !!formikUser.errors.name}
              helperText={formikUser.touched.name && formikUser.errors.name}
              fullWidth
              required
            />
          </Grid>
          <Grid item mt={mt} flexGrow={1} maxWidth={500}>
            <TextField
              variant='outlined'
              label='Email'
              name='email'
              value={formikUser.values.email}
              onChange={formikUser.handleChange}
              onBlur={formikUser.handleBlur}
              error={formikUser.touched.email && !!formikUser.errors.email}
              helperText={formikUser.touched.email && formikUser.errors.email}
              fullWidth
              required
            />
          </Grid>
          <Grid item mt={mt} flexGrow={1} maxWidth={500}>
            <TextField
              variant='outlined'
              label='mobile'
              name='mobile'
              value={formikUser.values.mobile}
              onChange={formikUser.handleChange}
              onBlur={formikUser.handleBlur}
              error={formikUser.touched.mobile && !!formikUser.errors.mobile}
              helperText={formikUser.touched.mobile && formikUser.errors.mobile}
              fullWidth
            />
          </Grid>

          <Grid item mt={mt} flexGrow={1} maxWidth={500}>
            <TextField
              variant='outlined'
              label='password'
              type='password'
              autoComplete='new-password'
              name='password'
              value={formikUser.values.password}
              onChange={formikUser.handleChange}
              onBlur={formikUser.handleBlur}
              error={
                formikUser.touched.password && !!formikUser.errors.password
              }
              helperText={
                formikUser.touched.password && formikUser.errors.password
              }
              fullWidth
              required
            />
          </Grid>

          <Grid item mt={mt} flexGrow={1} maxWidth={500}>
            <TextField
              variant='outlined'
              type='password'
              label='confirm password'
              autoComplete='new-password'
              name='confirmPassword'
              value={formikUser.values.confirmPassword}
              onChange={formikUser.handleChange}
              onBlur={formikUser.handleBlur}
              error={
                formikUser.touched.confirmPassword &&
                !!formikUser.errors.confirmPassword
              }
              helperText={
                formikUser.touched.confirmPassword &&
                formikUser.errors.confirmPassword
              }
              fullWidth
              required
            />
          </Grid>
          <Grid mt={mt} item width='100%'>
            <Button
              sx={{ mr: 1 }}
              variant='contained'
              size='large'
              onClick={() => setSteps(0)}
            >
              Back
            </Button>
            <LoadingButton
              loading={loading}
              variant='contained'
              size='large'
              type='submit'
            >
              {'Create'}
            </LoadingButton>
          </Grid>
        </form>
      )}
      <Grid item mt={mt} width={'100%'}>
        {formik.errors.axiosError && (
          <Typography color='error'>{formik.errors.axiosError}</Typography>
        )}
      </Grid>
    </div>
  );
};

export default CompanyForm;
