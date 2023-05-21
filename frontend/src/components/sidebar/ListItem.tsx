import {
  ListItem as MUIListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link } from 'atoms';

export interface ListItemProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  path: string;
  nested?: boolean;
  handleClick?: () => void;
}

const ListItem: React.FC<ListItemProps> = (props) => {
  return (
    <Link to={props.path} decorated={false}>
      <MUIListItem disablePadding>
        <ListItemButton
          role={undefined}
          onClick={props.handleClick}
          //</MUIListItem>dense={props.nested}
          sx={{ pl: props.nested ? 4 : 2 }}
        >
          {props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}
          <ListItemText id={'working'} primary={props.label} />
        </ListItemButton>
      </MUIListItem>
    </Link>
  );
};

export default ListItem;
