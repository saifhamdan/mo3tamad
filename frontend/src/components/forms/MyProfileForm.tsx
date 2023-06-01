import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { headers } from 'services/auth';

// interface
interface FormValues {
  name: string;
  email: string;
  mobile: string;

  axiosError: string;
}

// intial Form Values
const initialValues = {
  name: '',
  email: '',
  mobile: '',

  axiosError: '',
};

// data Mapper
const dataMapper = (data: User): FormValues => {
  return {
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    axiosError: '',
  };
};

// Validation Schema
const userValidationSchema = Yup.object().shape({
  name: Yup.string().required("user's name is required"),
  email: Yup.string()
    .email('must be a valid email')
    .required("user's email is required"),
  mobile: Yup.string(),
});

const mt = 3;
const MyProfileForm: React.FC<{ data?: any }> = (props) => {
  const isEditing = !!props.data;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const formik = useFormik({
    initialValues: isEditing ? dataMapper(props.data) : initialValues,
    validationSchema: userValidationSchema,
    onSubmit: async (values, state) => {
      setLoading(true);
      try {
        const data = {
          name: values.name,
          email: values.email,
          mobile: values.mobile,
        };
        await axios({
          url: `${process.env.REACT_APP_API_URL}/api/v1/accounts/me`,
          headers,
          method: 'PATCH',
          data,
        });
        setMessage('Saved Successfully');
        setTimeout(() => {
          setMessage('');
        }, 2000);
      } catch (err: any) {
        state.setFieldError('axiosError', err?.message);
      }
      setLoading(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid item mt={mt} flexGrow={1} maxWidth={500}>
        <TextField
          variant='outlined'
          label='name'
          name='name'
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && !!formik.errors.name}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
        />
      </Grid>
      <Grid item mt={mt} flexGrow={1} maxWidth={500}>
        <TextField
          variant='outlined'
          label='Email'
          name='email'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && !!formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
        />
      </Grid>
      <Grid item mt={mt} flexGrow={1} maxWidth={500}>
        <TextField
          variant='outlined'
          label='mobile'
          name='mobile'
          value={formik.values.mobile}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mobile && !!formik.errors.mobile}
          helperText={formik.touched.mobile && formik.errors.mobile}
          fullWidth
        />
      </Grid>

      <Grid item mt={mt} width={'100%'}>
        {formik.errors.axiosError && (
          <Typography mb={1} color='error'>
            {formik.errors.axiosError}
          </Typography>
        )}
        {message && (
          <Typography mb={1} color='info'>
            {message}
          </Typography>
        )}
      </Grid>
      <Grid item width={'100%'}>
        <LoadingButton
          loading={loading}
          variant='contained'
          size='large'
          type='submit'
        >
          {isEditing ? 'Save' : 'Create'}
        </LoadingButton>
      </Grid>
    </form>
  );
};

export default MyProfileForm;
