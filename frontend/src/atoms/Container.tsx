import styled from '@emotion/styled';

const sizes = {
  large: '1340px',
  medium: '1170px',
  small: '720px',
};
interface Props extends React.ComponentPropsWithoutRef<'div'> {
  size?: 'medium' | 'large' | 'small';
}

const Container = styled.div<Props>`
  margin: 0 auto;
  padding: 0rem 2rem;
  max-width: ${(props) => sizes[props.size ? props.size : 'medium']};

  @media only screen and (max-width: 1010px) {
    width: auto;
  }
  @media only screen and (max-width: 768px) {
    width: auto;
    padding: 2rem 1rem;
  }
`;

export default Container;
