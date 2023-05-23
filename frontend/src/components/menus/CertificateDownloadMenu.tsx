import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MenuList,
  ListItem,
  Divider,
  Box,
  ListItemText,
  Button,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@mui/material';

import { AuthContext } from 'store/auth-context';
import { Menu } from 'atoms';
import { ManageUserIcon } from 'atoms/icons';

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  closeHandler: () => void;
}

const CertificateDownloadMenu: React.FC<Props> = ({
  anchorEl,
  open,
  closeHandler,
}) => {
  const { user, logoutHandler: logoutHandlerAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    closeHandler();
    logoutHandlerAuth();
    navigate('/login');
  };

  return (
    <Menu open={open} anchorEl={anchorEl} onClose={closeHandler} autoClose>
      <Box textAlign='center' p={3} minWidth={230} maxWidth={'100%'}>
        <Typography mb={1} fontWeight='bold'>
          Choose the format
        </Typography>

        <Button sx={{ mr: 2 }} variant='outlined'>
          .png
        </Button>
        <Button variant='outlined'>.pdf</Button>
      </Box>
    </Menu>
  );
};

export default CertificateDownloadMenu;
