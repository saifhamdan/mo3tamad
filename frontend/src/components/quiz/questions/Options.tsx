import { Fragment } from 'react';
import {
  Box,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';

interface Props {
  options: any[];
  value: string | undefined;
  showAnswers?: boolean;
  answerHandler?: (opId: string) => void;
}

const Options: React.FC<Props> = ({
  options,
  value,
  showAnswers,
  answerHandler,
}) => {
  return (
    <Box>
      <FormControl>
        <RadioGroup
          value={value}
          onChange={(e) => {
            if (answerHandler) answerHandler(e.target.value);
          }}
        >
          {options.map((op, index) => (
            <Fragment key={index}>
              <FormControlLabel
                value={op._id}
                disabled={showAnswers}
                label={
                  <Grid container justifyItems='baseline'>
                    {`${String.fromCharCode(97 + index)}.`}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: op.body,
                      }}
                    />
                  </Grid>
                }
                control={<Radio size='small' />}
              />
            </Fragment>
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Options;
