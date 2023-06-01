import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormHelperText, Grid, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { headers, companyId } from 'services/auth';

// interface
interface FormValues {
  title: string;
  desc: string;
  passingScore: number;
  duration: number;
  thumbnailUrl: '';
  thumbnail: any;
  axiosError: string;
}

// intial Form Values
const initialValues = {
  title: '',
  desc: '',
  thumbnailUrl: '',
  thumbnail: null,
  duration: 0,
  passingScore: 0,
  axiosError: '',
};

// data Mapper
const dataMapper = (data: any): FormValues => {
  return {
    title: data.name,
    desc: data.desc,
    passingScore: data.passingScore,
    duration: data.duration,
    thumbnailUrl: data.thumbnailUrl,
    thumbnail: {
      name: data.thumbnailUrl,
    },
    axiosError: '',
  };
};

// Validation Schema
const examProjectValidationSchema = Yup.object().shape({
  title: Yup.string().required("exam's title is required"),
  desc: Yup.string().required("exam's description is required"),
  passingScore: Yup.number().required("exam's passingScore is required"),
  duration: Yup.number().required("exam's duration is required"),
  thumbnail: Yup.mixed().test(
    'thumbnail',
    "exam's thumbnail is required",
    (value: any) => {
      return !!value.name;
    }
  ),
});

const mt = 3;
const ExamProjectForm: React.FC<{ data?: any; id?: string }> = (props) => {
  const isEditing = !!props.data;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: isEditing ? dataMapper(props.data) : initialValues,
    validationSchema: examProjectValidationSchema,
    onSubmit: async (values, state) => {
      setLoading(true);
      try {
        console.log(values);
        const fd = new FormData();
        fd.append('name', values.title);
        fd.append('desc', values.desc);
        fd.append('passingScore', values.passingScore.toString());
        fd.append('duration', values.duration.toString());
        fd.append('companyId', companyId.toString());
        fd.append('thumbnail', values.thumbnail);

        await axios({
          url: `${process.env.REACT_APP_API_URL}/api/v1/exams/${
            props.id ? props.id : ''
          }`,
          headers,
          method: isEditing ? 'PATCH' : 'POST',
          data: fd,
        });
        navigate('/company/exams-projects');
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
          name='thumbnail'
          onChange={(e: any) => {
            console.log(e.target.files[0]);
            formik.setFieldValue('thumbnail', e.target.files[0]);
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.thumbnail && !!formik.errors.thumbnail}
          helperText={
            formik.touched.thumbnail && formik.errors.thumbnail?.toString()
          }
          fullWidth
          type='file'
        />
        {formik.values.thumbnail && (
          <Typography>
            thumbnail {formik.values.thumbnail?.name}.webp
          </Typography>
        )}
      </Grid>
      <Grid item mt={mt} flexGrow={1} maxWidth={500}>
        <TextField
          variant='outlined'
          label='title'
          name='title'
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && !!formik.errors.title}
          helperText={formik.touched.title && formik.errors.title}
          fullWidth
        />
      </Grid>
      <Grid item mt={mt} flexGrow={1} maxWidth={500}>
        <TextField
          variant='outlined'
          label='Description'
          name='desc'
          value={formik.values.desc}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.desc && !!formik.errors.desc}
          helperText={formik.touched.desc && formik.errors.desc}
          fullWidth
        />
      </Grid>
      <Grid item mt={mt} flexGrow={1} maxWidth={500}>
        <TextField
          variant='outlined'
          label='passing score'
          name='passingScore'
          type='number'
          InputProps={{ inputProps: { min: 1, max: 100 } }}
          value={formik.values.passingScore}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.passingScore && !!formik.errors.passingScore}
          helperText={formik.touched.passingScore && formik.errors.passingScore}
          fullWidth
        />
      </Grid>
      <Grid item mt={mt} flexGrow={1} maxWidth={500}>
        <TextField
          variant='outlined'
          label='duration'
          name='duration'
          type='number'
          InputProps={{ inputProps: { min: 1 } }}
          value={formik.values.duration}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.duration && !!formik.errors.duration}
          helperText={formik.touched.duration && formik.errors.duration}
          fullWidth
        />
        <FormHelperText>note: duration is counted in minutes</FormHelperText>
      </Grid>
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

export default ExamProjectForm;
