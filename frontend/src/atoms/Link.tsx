import {
  Link as ReactLink,
  LinkProps as ReactLinkProps,
} from 'react-router-dom';
import styled from '@emotion/styled';
import React from 'react';

interface LinkProps extends ReactLinkProps {
  decorated?: boolean;
  children: React.ReactNode;
}

interface StyledLinkProps extends ReactLinkProps {
  decorated?: string;
  children: React.ReactNode;
}

const StyledLink = styled(ReactLink)<StyledLinkProps>`
  text-decoration: ${({ decorated }) => (decorated ? 'underline' : 'none')};
  color: inherit;
`;

const Link: React.FC<LinkProps> = (props) => {
  return (
    <StyledLink {...props} decorated={props.decorated ? 'true' : undefined}>
      {props.children}
    </StyledLink>
  );
};

Link.defaultProps = {
  decorated: true,
};

export default Link;
