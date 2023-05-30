import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import MuiListItem from '@mui/material/ListItem';
import ImageIcon from '@mui/icons-material/Image';

import { AssessmentIcon, ManageUserIcon, OrgIcon } from 'atoms/icons';
import NestedListItem from './NestedListItem';
import ListItem from './ListItem';
import { Avatar, Divider, ListItemAvatar, ListItemText } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from 'store/auth-context';

const drawerWidth = 240;

interface Props {
  isMobile: boolean;
  openMobileDrawer: boolean;
  toggleMobileDrawerHandler: () => void;
}

const adminSidebar = [
  {
    nested: false,
    label: 'Exams',
    icon: <AssessmentIcon />,
    path: '/company/exams-projects',
    nestedList: [],
  },
  {
    nested: false,
    label: 'Users',
    icon: <ManageUserIcon />,
    path: '/company/users',
    nestedList: [],
  },
  {
    nested: false,
    label: 'Company Profile',
    icon: <OrgIcon />,
    path: '/company/profile',
    nestedList: [],
  },
];

const Sidebar = (props: Props) => {
  const { isMobile, openMobileDrawer, toggleMobileDrawerHandler } = props;
  const { user } = useContext(AuthContext);
  const drawer = (
    <div>
      {!isMobile && <Toolbar />}
      <List>
        <MuiListItem>
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user?.name}
            secondary={
              <div>
                <div>{user?.role?.desc}</div>
                <span>{user?.company?.name}</span>
              </div>
            }
          />
        </MuiListItem>
        <Divider />
        {adminSidebar.map((item, i) =>
          item.nestedList && item.nestedList.length > 0 ? (
            <NestedListItem key={i} {...item} />
          ) : (
            <ListItem key={i} {...item} />
          )
        )}
      </List>
    </div>
  );

  return (
    <Box
      component='nav'
      sx={{
        width: isMobile ? 0 : drawerWidth,
        position: 'relative',
        zIndex: 1,
      }}
      aria-label='mailbox folders'
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        anchor='left'
        variant={isMobile ? 'temporary' : 'permanent'}
        open={openMobileDrawer}
        onClose={toggleMobileDrawerHandler}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
