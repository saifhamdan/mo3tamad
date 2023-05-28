import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Checkbox, Grid, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { headers, companyId } from 'services/auth';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    [{ direction: 'rtl' }], // text direction
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],

    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
];

const Option = (props: any) => {
  return (
    <Grid item mt={mt}>
      <Grid container alignItems='flex-start' mb={1}>
        <Checkbox
          checked={props.isCorrect}
          onChange={(e) => {
            const opt = {
              text: props.text,
              isCorrect: e.target.checked,
            };
            props.onChange(props.index, opt);
          }}
        />
        <Grid item width='min-content' flexGrow={1}>
          <ReactQuill
            value={props.text}
            onChange={(text) => {
              const opt = {
                isCorrect: props.isCorrect,
                text,
              };
              props.onChange(props.index, opt);
            }}
            modules={modules}
            formats={formats}
          />
        </Grid>
      </Grid>
      <Button
        variant='contained'
        color='error'
        onClick={() => {
          props.onDelete(props.index);
        }}
      >
        Delete
      </Button>
    </Grid>
  );
};

// interface
interface FormValues {
  question: string;
  axiosError: string;
}

// intial Form Values
const initialValues = {
  question: '',
  axiosError: '',
};

// data Mapper
const dataMapper = (data: any): FormValues => {
  return {
    question: data.text,
    axiosError: '',
  };
};

// Validation Schema
const examProjectValidationSchema = Yup.object().shape({
  question: Yup.string().required("exam's question is required"),
});

const mt = 3;
const QuestionForm: React.FC<{ data?: any; id?: string }> = (props) => {
  const isEditing = !!props.data;
  const navigate = useNavigate();
  const { examId } = useParams();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<any>(
    isEditing && props.data.options ? props.data.options : []
  );

  const formik = useFormik({
    initialValues: isEditing ? dataMapper(props.data) : initialValues,
    validationSchema: examProjectValidationSchema,
    onSubmit: async (values, state) => {
      setLoading(true);
      try {
        const data = {
          examId: examId ? +examId : null,
          text: values.question,
          options,
        };
        await axios({
          url: `${process.env.REACT_APP_API_URL}/api/v1/questions/${
            props.id ? props.id : ''
          }`,
          headers,
          method: isEditing ? 'PATCH' : 'POST',
          data,
        });
        navigate(`/company/exams-projects/${examId}/questions`);
      } catch (err: any) {
        state.setFieldError('axiosError', err?.message);
      }
      setLoading(false);
    },
  });

  const AddOption = () => {
    const newOpt = {
      text: '',
      isCorrect: false,
    };

    setOptions((prev: any) => [...prev, newOpt]);
  };

  const modifyOption = (i: number, opt: any) => {
    const newOptions = [...options];
    newOptions[i] = { ...opt };

    setOptions(newOptions);
  };

  const deleteOption = (i: number) => {
    const newOptions = [...options];
    newOptions.splice(i, 1);
    setOptions(newOptions);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid item mt={mt} flexGrow={1}>
        <div>
          <ReactQuill
            value={formik.values.question}
            onChange={(t) => formik.setFieldValue('question', t)}
            modules={modules}
            formats={formats}
          />
        </div>
      </Grid>
      <Grid item mt={mt}>
        <Typography mr={2} variant='h6' component='span'>
          Options
        </Typography>
        <Button variant='contained' onClick={AddOption}>
          Add
        </Button>
      </Grid>
      {options.map((opt: any, index: number) => (
        <Option
          key={index}
          text={opt.text}
          index={index}
          isCorrect={opt.isCorrect}
          onChange={modifyOption}
          onDelete={deleteOption}
        />
      ))}
      <Grid item mt={mt} width={'100%'}>
        {formik.errors.axiosError && (
          <Typography color='error'>{formik.errors.axiosError}</Typography>
        )}
        {formik.errors.question && (
          <Typography color='error'>{formik.errors.question}</Typography>
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
