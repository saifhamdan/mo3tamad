import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { headers, companyId } from 'services/auth';

// interface
interface FormValues {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  axiosError: string;
}

// intial Form Values
const initialValues = {
  name: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  axiosError: '',
};

// data Mapper
const dataMapper = (data: User): FormValues => {
  return {
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    password: '123',
    confirmPassword: '123',

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
  password: Yup.string()
    .min(3, 'password should at least contain 3 characters')
    .max(26, 'password should not contain more than 26 character')
    .required('user must has a password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('user must has a password'),
  roleId: Yup.number().required('a user should belong to a role'),
});

const mt = 3;
const UserForm: React.FC<{ data?: any; id?: string }> = (props) => {
  const isEditing = !!props.data;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
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
          password: values.password,
          companyId,
        };
        await axios({
          url: `${
            process.env.REACT_APP_API_URL
          }/api/v1/accounts/${companyId}/users/${props.id ? props.id : ''}`,
          headers,
          method: isEditing ? 'PATCH' : 'POST',
          data,
        });
        navigate('/admin/users');
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
          required
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
          required
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
      {!isEditing && (
        <Grid item mt={mt} flexGrow={1} maxWidth={500}>
          <TextField
            variant='outlined'
            label='password'
            type='password'
            autoComplete='new-password'
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            required
          />
        </Grid>
      )}
      {!isEditing && (
        <Grid item mt={mt} flexGrow={1} maxWidth={500}>
          <TextField
            variant='outlined'
            label='confirm password'
            type='password'
            autoComplete='new-password'
            name='confirmPassword'
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword && !!formik.errors.confirmPassword
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            fullWidth
            required
          />
        </Grid>
      )}
      <Grid item mt={mt} width={'100%'}>
        {formik.errors.axiosError && (
          <Typography color='error'>{formik.errors.axiosError}</Typography>
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

export default UserForm;
