import { Link as RouterLink, useLocation } from 'react-router-dom';
import Link, { LinkProps } from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import MUIBreadcrumbs from '@mui/material/Breadcrumbs';
import { useAppDispatch, useAppSelector } from 'store';
import { HomeIcon } from 'atoms/icons';
import { useEffect } from 'react';
import { uiActions } from 'store/ui-slice';
import { Container } from 'atoms';

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

function LinkRouter(props: LinkRouterProps) {
  return <Link {...props} component={RouterLink as any} />;
}

const Breadcrumbs = () => {
  const dispatch = useAppDispatch();
  const breads = useAppSelector((state) => state.ui.breadcrumbs);
  const location = useLocation();

  useEffect(() => {
    dispatch(uiActions.ChangeBreadcrumb([]));
  }, [location.pathname]);

  return (
    <Container size='large'>
      <MUIBreadcrumbs
        aria-label='breadcrumb'
        sx={{
          my: 3,
          fontSize: 20,
        }}
      >
        {breads.length > 0 && (
          <LinkRouter to='/'>
            <HomeIcon color='primary' />
          </LinkRouter>
        )}

        {breads.map((bread, index) => {
          const last = index === breads.length - 1;
          return last || !bread.path ? (
            <Typography
              key={index}
              color={last ? 'text.primary' : 'inherit'}
              fontSize={20}
            >
              {bread.label}
            </Typography>
          ) : (
            <LinkRouter
              underline='hover'
              color='inherit'
              to={bread.path}
              key={index}
              fontSize={20}
            >
              {bread.label}
            </LinkRouter>
          );
        })}
      </MUIBreadcrumbs>
    </Container>
  );
};

export default Breadcrumbs;
