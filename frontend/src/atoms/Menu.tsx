import React from 'react';
// import { useSelector } from 'react-redux';
import { Popper, Grow, Paper, ClickAwayListener } from '@mui/material';
import { PopperProps } from '@mui/material/Popper/Popper';

// import { RootState } from 'store';

interface Props extends PopperProps {
  onClose: () => void;
  open: boolean;
  autoClose?: boolean;
  children: React.ReactNode;
}

const Menu: React.FC<Props> = (props) => {
  // const direction = useSelector((state: RootState) => state.ui.direction);
  const placement = props.placement ? props.placement : 'bottom-end';

  return (
    <Popper
      open={props.open}
      anchorEl={props.anchorEl}
      role={undefined}
      placement={placement}
      transition
      style={{
        position: 'absolute',
        zIndex: 1300,
      }}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === 'bottom-start' ? 'left top' : 'right top',
          }}
        >
          <Paper elevation={8}>
            <ClickAwayListener onClickAway={props.onClose}>
              <div onClick={props.autoClose ? props.onClose : undefined}>
                {props.children}
              </div>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default Menu;
