import {
  Dialog,
  Box,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface Props {
  open: boolean;
  closeHandler: () => void;
  actionHandler: () => void;
  headerText: string;
  bodyText: string;
  confirmButtonText: string;
  cancelButtonText: string;
  actionAsCloseHandler?: boolean;
}

const ConfirmationModal: React.FC<Props> = (props) => {
  const actionAndCloseHandler = () => {
    props.actionHandler();
    props.closeHandler();
  };
  return (
    <Dialog
      open={props.open}
      onClose={
        props.actionAsCloseHandler ? props.actionHandler : props.closeHandler
      }
      maxWidth='xs'
    >
      <Box>
        <DialogTitle>{props.headerText}</DialogTitle>
        <DialogContent>
          <Typography
            style={{
              wordWrap: 'break-word',
            }}
            color='text.primary'
          >
            {props.bodyText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={actionAndCloseHandler}>
            {props.confirmButtonText}
          </Button>
          <Button variant='contained' onClick={props.closeHandler}>
            {props.cancelButtonText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
