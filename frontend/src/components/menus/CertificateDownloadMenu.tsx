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
  certificateUrl: string;
  anchorEl: HTMLElement | null;
  closeHandler: () => void;
}

const CertificateDownloadMenu: React.FC<Props> = ({
  anchorEl,
  certificateUrl,
  open,
  closeHandler,
}) => {
  const navigate = useNavigate();

  return (
    <Menu open={open} anchorEl={anchorEl} onClose={closeHandler} autoClose>
      <Box textAlign='center' p={3} minWidth={230} maxWidth={'100%'}>
        <Typography mb={1} fontWeight='bold'>
          Choose the format
        </Typography>

        <a
          href={`${process.env.REACT_APP_API_URL}/certificates/${certificateUrl}?type=png`}
        >
          <Button sx={{ mr: 2 }} variant='outlined'>
            .png
          </Button>
        </a>
        <a
          href={`${process.env.REACT_APP_API_URL}/certificates/${certificateUrl}?type=pdf`}
        >
          <Button variant='outlined'>.pdf</Button>
        </a>
      </Box>
    </Menu>
  );
};

export default CertificateDownloadMenu;
