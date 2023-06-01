import {
  Dialog,
  Box,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useTimer } from 'react-timer-hook';
import { headers } from 'services/auth';

interface Props {
  open: boolean;
  registerId: number;
  closeHandler: () => void;
  //   // actionHandler: () => void;
  //   // headerText: string;
  //   // bodyText: string;
  //   // confirmButtonText: string;
  //   // cancelButtonText: string;ss
  //   // actionAsCloseHandler?: boolean;
}

const CheatModal: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  let d = new Date();
  d.setSeconds(d.getSeconds() + 6);

  const cheatHandler = async () => {
    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/registration/${props.registerId}/cheat`,
        method: 'PATCH',
        headers,
      });
      navigate('/my-exams');
    } catch (err) {
      console.error(err);
    }
  };

  const { seconds } = useTimer({
    autoStart: true,
    expiryTimestamp: d,
    onExpire: cheatHandler,
  });

  const returnToFullScreenMode = () => {
    const elem: any = document.documentElement;
    if (!document.fullscreenElement) {
      // Enter fullscreen mode
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
    props.closeHandler();
  };

  return (
    <Dialog open={props.open} maxWidth='xs'>
      <Box>
        <DialogTitle color={'error'}>WARNING!!</DialogTitle>
        <DialogContent>
          <Typography
            style={{
              wordWrap: 'break-word',
            }}
            color='text.primary'
          >
            {`If you don't return to full screen within ${seconds} seconds, it will be considered cheating.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={returnToFullScreenMode}>
            {'return to full screen mode'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CheatModal;
