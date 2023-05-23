import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { headers, accountId } from 'services/auth';

// interface
interface FormValues {
  name: string;
  desc: string;
  duration: number;
  axiosError: string;
}

// intial Form Values
const initialValues = {
  name: '',
  desc: '',
  duration: 1,
  axiosError: '',
};

// data Mapper
const dataMapper = (data: any): FormValues => {
  return {
    name: data.name,
    desc: data.desc,
    duration: data.duration,
    axiosError: '',
  };
};

// Validation Schema
const examProjectValidationSchema = Yup.object().shape({
  name: Yup.string().required("exam's name is required"),
  desc: Yup.string().required("exam's description is required"),
  duration: Yup.number().required("exam's duration is required"),
});

const mt = 3;
const QuestionForm: React.FC<{ data?: any; id?: string }> = (props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const isEditing = !!props.data;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditorState(EditorState.createEmpty());
  }, []);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: isEditing ? dataMapper(props.data) : initialValues,
    validationSchema: examProjectValidationSchema,
    onSubmit: async (values, state) => {
      setLoading(true);
      try {
        const data = {
          name: values.name,
          desc: values.desc,
          duration: values.duration,
        };
        await axios({
          url: `${
            process.env.REACT_APP_API_URL
          }/api/v1/accounts/${accountId}/users/${props.id ? props.id : ''}`,
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
      <Grid item mt={mt} flexGrow={1} height={500}>
        <div>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName='demo-wrapper'
            editorClassName='demo-editor'
          />
        </div>
        {/* <TextField
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
        /> */}
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
          required
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
          required
        />
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

export default QuestionForm;
