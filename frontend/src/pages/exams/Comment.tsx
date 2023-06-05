import { Box, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { headers } from 'services/auth';

interface Props {
  text: string;
  accountName?: string;
  commentId?: number;
  accountId: number;
  examId: number;
  isEdit: boolean;
  disabled?: boolean;
  addComment?: (comment: any) => void;
  updateComment?: (comment: any) => void;
  removeComment?: (commentId: number) => void;
}

const Comment: React.FC<Props> = (props) => {
  const [editor, setEditor] = useState(!props.isEdit);
  const [value, setValue] = useState(props.text);

  const submitComment = async () => {
    try {
      const res = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/comment/${
          props.commentId ? props.commentId : ''
        }`,
        method: props.isEdit ? 'PATCH' : 'POST',
        headers: headers,
        data: {
          desc: value,
          examId: props.examId,
          accountId: props.accountId,
        },
      });
      console.log(props.isEdit);
      if (props.isEdit) {
        if (props.updateComment) {
          props.updateComment(res.data.data);
          setEditor(false);
        }
      } else {
        if (props.addComment) props.addComment(res.data.data);
        setValue('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeComment = async () => {
    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/comment/${props.commentId}`,
        method: 'DELETE',
        headers: headers,
      });
      if (props.removeComment && props.commentId)
        props.removeComment(props.commentId);
      setEditor(false);
    } catch (err) {
      console.error(err);
    }
  };
  console.log(editor, props.disabled);
  return (
    <Box my={1}>
      {editor && !props.disabled && (
        <>
          <TextField
            fullWidth
            placeholder={props.isEdit ? 'edit comment' : 'new comment'}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={submitComment}>
                  <SendIcon />
                </IconButton>
              ),
            }}
          />
          {props.isEdit && (
            <Typography
              onClick={() => {
                setValue(props.text);
                setEditor(false);
              }}
              variant='button'
              sx={{
                cursor: 'pointer',
              }}
              color='red'
            >
              cancel
            </Typography>
          )}
        </>
      )}
      {!editor && props.isEdit && (
        <Box p={1} borderRadius={1} border='1px solid #9999'>
          <Typography variant='body2'>
            {props.accountName} commented:
          </Typography>
          <Typography>{value}</Typography>
          {!props.disabled && (
            <>
              <Typography
                variant='button'
                component='span'
                mr={1}
                sx={{
                  cursor: 'pointer',
                }}
                onClick={() => setEditor(true)}
              >
                Edit
              </Typography>
              <Typography
                variant='button'
                component='span'
                color='red'
                sx={{
                  cursor: 'pointer',
                }}
                onClick={removeComment}
              >
                Delete
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Comment;
