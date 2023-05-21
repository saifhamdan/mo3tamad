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

const AccountMenu: React.FC<Props> = ({ anchorEl, open, closeHandler }) => {
  const { user, logoutHandler: logoutHandlerAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    closeHandler();
    logoutHandlerAuth();
    navigate('/login');
  };

  return (
    <Menu open={open} anchorEl={anchorEl} onClose={closeHandler} autoClose>
      <Box minWidth={230} maxWidth={'100%'}>
        <MenuList>
          <ListItem
            sx={{
              py: 0,
            }}
          >
            <ListItemText
              primaryTypographyProps={{
                color: 'text.black',
                fontWeight: 500,
              }}
              secondaryTypographyProps={{
                color: 'text.black',
              }}
              primary={user?.name}
              secondary={
                <>
                  {user?.email}
                  <div>{user?.org?.desc}</div>
                </>
              }
            />
            {/* <Typography variant='subtitle1' color='text.black'></Typography> */}
          </ListItem>
          <Divider />
          <MenuList>
            <MenuItem>
              <ListItemIcon>
                <ManageUserIcon />
              </ListItemIcon>
              <Typography variant='body2' color='text.black'>
                My profile
              </Typography>
            </MenuItem>
          </MenuList>
          <ListItem
            dense={true}
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <Button variant='outlined' fullWidth onClick={logoutHandler}>
              Logout
            </Button>
          </ListItem>
        </MenuList>
      </Box>
    </Menu>
  );
};

export default AccountMenu;
