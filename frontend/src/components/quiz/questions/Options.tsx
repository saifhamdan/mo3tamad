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
  answerId: string | undefined;
  answerHandler?: (opId: string) => void;
}

const Options: React.FC<Props> = ({ options, answerId, answerHandler }) => {
  return (
    <Box>
      <FormControl>
        <RadioGroup
          value={answerId}
          onChange={(e) => {
            if (answerHandler) answerHandler(e.target.value);
          }}
        >
          {options.map((op, index) => (
            <Fragment key={index}>
              <FormControlLabel
                value={op.id}
                label={
                  <Grid container justifyItems='baseline'>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: op.text,
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
