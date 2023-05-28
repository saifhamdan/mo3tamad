import { useEffect, useState } from 'react';

import { Button, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Container, Link } from 'atoms';
import useFetch from 'hooks/use-fetch';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import { examProjectApplicantsBreadcrumbsPage } from 'components/common/breadcrumbsList';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';
import { useParams } from 'react-router';

const ExamApplicantsPage = () => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<any[]>([]);
  const { examId } = useParams();
  const url = `${process.env.REACT_APP_API_URL}/api/v1/registration/byExam/${examId}`;
  const { data, error, loading, setData } = useFetch<any[]>(url, []);

  useEffect(() => {
    dispatch(
      uiActions.ChangeBreadcrumb(examProjectApplicantsBreadcrumbsPage(data))
    );
  }, [dispatch, data]);

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
      headerName: 'Action',
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        const onDelete = async () => {
          try {
            // await deleteProjectAssessment(params.row.id);
            const newData = data.filter((d: any) => d.id !== params.row.id);
            setData(newData);
          } catch (err) {
            console.error(err);
          }
        };

        return (
          <Stack direction='row' spacing={2}>
            <Button variant='outlined' size='small'>
              Approve
            </Button>
            <Button variant='outlined' size='small'>
              Decline
            </Button>
          </Stack>
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
    </Container>
  );
};

export default ExamApplicantsPage;
