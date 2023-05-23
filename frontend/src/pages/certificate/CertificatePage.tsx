import { Button, Grid, Typography } from '@mui/material';
import { Container, MenuWrapper } from 'atoms';
import { DownloadIcon } from 'atoms/icons';
import CertificateDownloadMenu from 'components/menus/CertificateDownloadMenu';

const CertificatePage = () => {
  return (
    <Container size='large'>
      <Grid gap={4} container width='100%' py={3}>
        <Grid sx={{ width: { xs: '100%', lg: 'calc(100% - 332px)' } }} item>
          <Grid item mb={1} border='1px solid #555'>
            <img
              src='https://picsum.photos/500/800'
              width={'100%'}
              height={'700px'}
              alt='certificate'
            />
          </Grid>
          <Typography>
            This certificate above verifies that Saif hamdan successfully
            completed the course Build an app with ASPNET Core and Angular from
            scratch on 09/04/2022 as taught by Neil Cummings on Udemy. The
            certificate indicates the entire course was completed as validated
            by the student. The course duration represents the total video hours
            of the course at time of most recent completion.
          </Typography>
        </Grid>

        <Grid item sx={{ width: { xs: '100%', lg: '300px' } }}>
          <Typography mb={1} fontSize={20} fontWeight='bold'>
            Certificate Recipient:
          </Typography>
          <Typography mb={2} fontSize={18}>
            Saif Hamdan
          </Typography>
          <Typography mb={1} fontSize={20} fontWeight='bold'>
            About the Exam:
          </Typography>
          <Grid container gap={1} mb={1}>
            <Grid item>
              <img
                src='https://picsum.photos/300/200'
                width='100%'
                height='100%'
                alt='certificate'
              />
            </Grid>
            <Grid item>
              <Typography fontSize={22}>java certifcation exam</Typography>
              <Typography mb={1} component='span' color='primary'>
                Oracle
              </Typography>
              <Typography>
                score{' '}
                <Typography component='span' fontWeight='bold'>
                  50%
                </Typography>
              </Typography>
              <Typography mb={1}>
                status{' '}
                <Typography component='span' fontWeight='bold'>
                  passed
                </Typography>
              </Typography>
            </Grid>
          </Grid>

          <MenuWrapper>
            {(props) => (
              <>
                <Button onClick={props.onOpen} variant='outlined'>
                  <DownloadIcon />
                  Download
                </Button>
                <CertificateDownloadMenu
                  anchorEl={props.anchorEl}
                  closeHandler={props.onClose}
                  open={props.open}
                />
              </>
            )}
          </MenuWrapper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CertificatePage;
