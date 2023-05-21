import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import MuiListItem from '@mui/material/ListItem';
import ImageIcon from '@mui/icons-material/Image';

import {
  AssessmentIcon,
  DashboardIcon,
  GroupIcon,
  GroupsIcon,
  ManageUserIcon,
  OrgIcon,
  PeopleIcon,
  PersonIcon,
} from 'atoms/icons';
import NestedListItem from './NestedListItem';
import ListItem from './ListItem';
import { Avatar, Divider, ListItemAvatar, ListItemText } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from 'store/auth-context';

const drawerWidth = 240;

interface Props {
  admin: boolean | undefined;
  client: boolean | undefined;
  isMobile: boolean;
  openMobileDrawer: boolean;
  toggleMobileDrawerHandler: () => void;
}

const clientSidebar = [
  {
    nested: true,
    label: 'My Assessments',
    icon: <AssessmentIcon />,
    path: '',
    keepOpen: true,
    nestedList: [
      {
        label: (
          <span>
            {/* <span style={{ fontWeight: 'bold' }}>(2)</span> */}
            Working
          </span>
        ),
        path: '/assessments/working',
        icon: '',
      },
      {
        label: (
          <span>
            {/* <span style={{ fontWeight: 'bold' }}>(1)</span> */}
            Completed
          </span>
        ),
        path: '/assessments/completed',
        icon: '',
      },
    ],
  },
];

const adminSidebar = [
  {
    nested: false,
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/admin/dashboard',
    nestedList: [],
  },
  {
    nested: false,
    label: 'Assessments',
    icon: <AssessmentIcon />,
    path: '/admin/assessments-projects',
    nestedList: [],
  },
  {
    nested: false,
    label: 'Organization',
    icon: <OrgIcon />,
    path: '/admin/organization',
    nestedList: [
      {
        nested: true,
        label: 'Sectors',
        icon: <GroupIcon />,
        path: '/admin/organization/sectors',
        nestedList: [],
      },
      {
        nested: true,
        label: 'Departments',
        icon: <GroupsIcon />,
        path: '/admin/organization/departments',
        nestedList: [],
      },
      {
        nested: true,
        label: 'Sections',
        icon: <PeopleIcon />,
        path: '/admin/organization/sections',
        nestedList: [],
      },
      {
        nested: true,
        label: 'Employees',
        icon: <PersonIcon />,
        path: '/admin/organization/employees',
        nestedList: [],
      },
    ],
  },
  {
    nested: false,
    label: 'Users',
    icon: <ManageUserIcon />,
    path: '/admin/users',
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
          <ListItemText primary={user?.name} secondary={user?.org?.desc} />
        </MuiListItem>
        <Divider />
        {props.client &&
          clientSidebar.map((item, i) =>
            item.nestedList && item.nestedList.length > 0 ? (
              <NestedListItem key={i} {...item} />
            ) : (
              <ListItem key={i} {...item} />
            )
          )}
        {props.admin &&
          adminSidebar.map((item, i) =>
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
