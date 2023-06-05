import styled from '@emotion/styled';
import { Grid, Box, Button, Typography, Chip } from '@mui/material';

import { Link } from 'atoms';

export const ExamPaper = styled.a`
  max-width: 100%;
  padding: 0rem;
  display: block;
  box-shadow: 0px 2px 4px 2px #5555;
  transition: all 0.3s;
  cursor: pointer;
  &:hover,
  &:active {
    box-shadow: 0px 2px 4px 5px #5555;
    transform: scale(1.02);
  }
`;

const ExamCard: React.FC<any> = (props) => {
  return (
    <Link to={`/exams/${props.id}`}>
      <ExamPaper>
        <Grid
          display='inline-flex'
          height='100%'
          container
          flexDirection='column'
        >
          <span
            className='course-card-a'
            style={{
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}/thumbnails/${props.thumbnailUrl}`}
              alt={`${props.name} thumbnail`}
              draggable={false}
              height={200}
              placeholder='blur'
              // blurDataURL='/blur/course-blur.webp'
              loading='eager'
              style={{
                width: '100%',
                borderTopLeftRadius: 'var(--border-radius)',
                borderTopRightRadius: 'var(--border-radius)',
              }}
            />
          </span>
          <Box p={1.5}>
            <Box mb={3} flexGrow={1}>
              <Typography fontSize={22}>{props.name}</Typography>
              <Typography color='gray'>{props.desc}</Typography>
              <Typography>
                Created by
                <Typography
                  ml={1}
                  color='primary'
                  fontWeight='bold'
                  component='span'
                >
                  <Link to='' color='primary'>
                    {props.company.name}
                  </Link>
                </Typography>
                {props.categories && (
                  <Box my={1}>
                    {props.categories.map((c: any) => (
                      <Chip key={c.id} label={c.desc} sx={{ mr: 0.5 }} />
                    ))}
                  </Box>
                )}
                {props.level && (
                  <Typography color='gray'>
                    level: {props.level.desc}
                  </Typography>
                )}
              </Typography>
            </Box>
            <Box>
              <Button variant='contained'>Get Certifcate</Button>
            </Box>
          </Box>
        </Grid>
      </ExamPaper>
    </Link>
  );
};
export default ExamCard;
