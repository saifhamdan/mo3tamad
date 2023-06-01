import { useEffect, useState } from 'react';

import { Button, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Container } from 'atoms';
import useFetch from 'hooks/use-fetch';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import { examProjectApplicantsBreadcrumbsPage } from 'components/common/breadcrumbsList';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';
import { useParams } from 'react-router';
import ConfirmationModal from 'components/modals/ConfirmationModal';

const ExamApplicantsPage = () => {
  const { examId } = useParams();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<any[]>([]);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [confirmDecline, setConfirmDecline] = useState(false);
  const url = `${process.env.REACT_APP_API_URL}/api/v1/registration/byExam/${examId}`;
  const { data, error, loading, setData } = useFetch<any[]>(url, []);

  useEffect(() => {
    dispatch(
      uiActions.ChangeBreadcrumb(examProjectApplicantsBreadcrumbsPage(data))
    );
  }, [dispatch, data]);

  const declineHandler = async () => {
    try {
    } catch (err) {
      console.error(err);
    }
  };

  const approveHandler = async () => {
    try {
    } catch (err) {
      console.error(err);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Candidate name',
      flex: 1,
      valueGetter: (params) => params.row.account.name,
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'passed', headerName: 'Passed', flex: 1 },
    { field: 'isCheated', headerName: 'Cheated', flex: 1 },
    { field: 'result', headerName: 'Result', flex: 1 },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return (
          params.row.status === 'waiting-approval' && (
            <Stack direction='row' spacing={2}>
              <Button
                variant='outlined'
                size='small'
                onClick={() => setConfirmApprove(true)}
              >
                Approve
              </Button>
              <Button
                variant='outlined'
                size='small'
                onClick={() => setConfirmDecline(true)}
              >
                Decline
              </Button>
            </Stack>
          )
        );
      },
    },
  ];

  return (
    <Container size='large'>
      <Grid container justifyContent='space-between'>
        <Grid item>
          <Typography variant='h5'>Applicants list</Typography>
        </Grid>
      </Grid>
      <Grid mt={3} flexDirection='row-reverse' container></Grid>
      <Grid item height={500}>
        <LoadingSpinnerWrapper error={error} loading={loading}>
          <DataGrid
            columns={columns}
            onRowSelectionModelChange={(newRowSelectionModel) =>
              setSelected(newRowSelectionModel)
            }
            rowSelectionModel={selected}
            // loading={loading}
            rows={data}
            checkboxSelection
          />
        </LoadingSpinnerWrapper>
      </Grid>

      <ConfirmationModal
        open={confirmApprove}
        actionHandler={approveHandler}
        headerText='Confirm Approval'
        cancelButtonText='cancel'
        confirmButtonText='approve'
        closeHandler={() => setConfirmApprove(false)}
        bodyText={`are you sure you want to apporve this applicant?`}
      />
      <ConfirmationModal
        open={confirmDecline}
        actionHandler={declineHandler}
        headerText='Confirm Decline'
        cancelButtonText='cancel'
        confirmButtonText='decline'
        closeHandler={() => setConfirmDecline(false)}
        bodyText={`are you sure you want to decline this applicant?`}
      />
    </Container>
  );
};

export default ExamApplicantsPage;
