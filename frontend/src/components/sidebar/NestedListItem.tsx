import {
  ListItem as MUIListItem,
  ListItemIcon,
  List,
  ListItemText,
  Collapse,
  ListItemButton,
} from '@mui/material';
import { useState } from 'react';
import ListItem, { ListItemProps } from './ListItem';
interface Props {
  icon: React.ReactNode;
  label: React.ReactNode;
  keepOpen?: boolean;
  handleClick?: () => void;
  nestedList: ListItemProps[];
}

const NestedListItem: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(props.keepOpen ? true : false);
  return (
    <>
      <MUIListItem disablePadding>
        <ListItemButton onClick={() => !props.keepOpen && setOpen(!open)}>
          <ListItemIcon>{props.icon}</ListItemIcon>
          <ListItemText primary={props.label} />
        </ListItemButton>
      </MUIListItem>
      <Collapse in={open}>
        <List>
          {props.nestedList.map((item, i) => (
            <ListItem key={i} {...item} nested={true} />
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default NestedListItem;
