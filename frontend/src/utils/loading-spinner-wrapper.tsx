import { Box, CircularProgress, Typography } from '@mui/material';

interface Props {
  error: Error | undefined;
  loading: boolean;
  children: React.ReactNode;
}

const LoadingSpinnerWrapper: React.FC<Props> = (props) => {
  return (
    <>
      {props.loading && (
        <Box mt={3} textAlign={'center'} width='100%'>
          <CircularProgress size={70} />
        </Box>
      )}
      {props.error && (
        <Box mt={3} textAlign={'center'} width='100%'>
          <Typography>Something went wrong! Please Try again later.</Typography>
        </Box>
      )}

      {!props.error && !props.loading && props.children}
    </>
  );
};

export default LoadingSpinnerWrapper;
