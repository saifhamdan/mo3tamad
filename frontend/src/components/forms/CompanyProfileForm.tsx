import React, { useContext, useState } from 'react';

import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Typography } from '@mui/material';

import { headers } from 'services/auth';
import { LoadingButton } from '@mui/lab';
import { AuthContext } from 'store/auth-context';

// interface
interface FormValues {
  name: string;
  desc: string;
  mobile: number;
  axiosError: string;
}

// data Mapper
const dataMapper = (data: any): FormValues => {
  return {
    name: data.name,
    desc: data.desc,
    mobile: data.phoneNumber,
    axiosError: '',
  };
};

// Validation Schema
const companyValidationSchema = Yup.object().shape({
  name: Yup.string().required("company's name is required"),
  desc: Yup.string().required("company's description is required"),
  mobile: Yup.string().required("company's mobile is required "),
});

const mt = 3;
const CompanyProfileForm: React.FC<{ data: any; id: number }> = (props) => {
  const { policies } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: dataMapper(props.data),
    validationSchema: companyValidationSchema,
    onSubmit: async (values, state) => {
      setLoading(true);
      try {
        const data = {
          name: formik.values.name,
          desc: formik.values.desc,
          phoneNumber: formik.values.mobile,
        };
        await axios({
          url: `${process.env.REACT_APP_API_URL}/api/v1/company/${props.id}`,
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
          label='company name'
          name='name'
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && !!formik.errors.name}
          helperText={formik.touched.name && formik.errors.name}
          disabled={!policies?.adminAll}
          fullWidth
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
          disabled={!policies?.adminAll}
          fullWidth
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
          disabled={!policies?.adminAll}
        />
      </Grid>
      <Grid mt={mt} item width={'100%'}>
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
          disabled={!policies?.adminAll}
        >
          Save
        </LoadingButton>
      </Grid>
    </form>
  );
};

export default CompanyProfileForm;
