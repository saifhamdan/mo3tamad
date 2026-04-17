import { ReactElement, useState } from 'react';

interface MenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
}

interface Props {
  children(values: MenuProps): ReactElement;
}

const MenuWrapper: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const onOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const values = {
    open,
    anchorEl,
    onOpen,
    onClose,
  };

  return <div style={{ display: 'inline-block' }}>{children(values)}</div>;
};

export default MenuWrapper;
