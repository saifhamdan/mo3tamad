import { Button, Grid, Typography } from '@mui/material';
import { Container, MenuWrapper } from 'atoms';
import { DownloadIcon } from 'atoms/icons';
import axios from 'axios';
import CertificateDownloadMenu from 'components/menus/CertificateDownloadMenu';
import useFetch from 'hooks/use-fetch';
import { useParams } from 'react-router';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';

const CertificatePage = () => {
  const { examId } = useParams();
  const { data, loading, error } = useFetch<any>(
    `${process.env.REACT_APP_API_URL}/api/v1/exams/${examId}`,
    {}
  );

  let outputDateString: any = '';
  if (data.id) {
    const inputDate = new Date(data.registration.issuedAt);

    const options: any = { month: 'short', day: 'numeric', year: 'numeric' };
    outputDateString = inputDate.toLocaleDateString('en-US', options);
  }

  return (
    <Container size='large'>
      <LoadingSpinnerWrapper loading={loading} error={error}>
        {data.id && (
          <>
            <Grid gap={4} container width='100%' py={3}>
              <Grid
                sx={{ width: { xs: '100%', lg: 'calc(100% - 332px)' } }}
                item
              >
                <Grid item mb={1} border='1px solid #555'>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/certificates/${data.registration.certificateUrl}?type=png`}
                    width={'100%'}
                    height={'700px'}
                    alt='certificate'
                  />
                </Grid>
                <Typography>
                  This certificate above verifies that{' '}
                  <strong>{data.registration.account.name}</strong> has
                  successfully completed the <strong>{data.name}</strong>{' '}
                  examination conducted by <strong>{data.company.name}</strong>{' '}
                  on <strong>{outputDateString}</strong> with a grade of{' '}
                  <strong>{data.registration.result}%</strong>. The applicant
                  has demonstrated a commendable level of knowledge and
                  expertise in the subject matter.
                </Typography>
              </Grid>

              <Grid item sx={{ width: { xs: '100%', lg: '300px' } }}>
                <Typography mb={1} fontSize={20} fontWeight='bold'>
                  Certificate Recipient:
                </Typography>
                <Typography mb={2} fontSize={18}>
                  {data.registration.account.name}
                </Typography>
                <Typography mb={1} fontSize={20} fontWeight='bold'>
                  About the Exam:
                </Typography>
                <Grid container gap={1} mb={1}>
                  <Grid item border='1px solid #555'>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/thumbnails/${data?.thumbnailUrl}`}
                      width='100%'
                      height='100%'
                      alt='certificate'
                    />
                  </Grid>
                  <Grid item>
                    <Typography fontSize={22}>{data.name}</Typography>
                    <Typography mb={1} component='span' color='primary'>
                      {data.company.name}
                    </Typography>
                    <Typography>
                      score{' '}
                      <Typography component='span' fontWeight='bold'>
                        {data.registration.result}%
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
                        certificateUrl={data.registration.certificateUrl}
                      />
                    </>
                  )}
                </MenuWrapper>
              </Grid>
            </Grid>
          </>
        )}
      </LoadingSpinnerWrapper>
    </Container>
  );
};

export default CertificatePage;
