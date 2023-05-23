import { useEffect, useState } from 'react';

import { Button, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Container, Link } from 'atoms';
import useFetch from 'hooks/use-fetch';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import { accountId } from 'services/auth';
import { examsProjectsBreadcrumbsPage } from 'components/common/breadcrumbsList';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';

const url = `${process.env.REACT_APP_API_URL}/api/v1/accounts/${accountId}/assessments/projects`;

const ExamsProjectsPage = () => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<any[]>([]);
  // const { data, error, loading, setData } = useFetch<any[]>(url, [
  //   { id: 1, name: 'java' },
  // ]);

  const data = [{ id: 1, name: 'java' }];
  const error = undefined;
  const loading = false;

  useEffect(() => {
    dispatch(uiActions.ChangeBreadcrumb(examsProjectsBreadcrumbsPage));
  }, [dispatch]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'type', headerName: 'Type' },
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
            // setData(newData);
          } catch (err) {
            console.error(err);
          }
        };

        return (
          <Stack direction='row' spacing={2}>
            <Link to={`${params.id}/questions`} decorated={false}>
              <Button variant='outlined' size='small'>
                Questions List
              </Button>
            </Link>
            <Link to={`${params.id}/applicants`} decorated={false}>
              <Button variant='outlined' size='small'>
                Show applicants
              </Button>
            </Link>
            <Button variant='outlined' size='small' onClick={onDelete}>
              Delete
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
          <Typography variant='h5'>Exams Projects</Typography>
        </Grid>
        <Grid item>
          <Link to='/company/exams-projects/new' decorated={false}>
            <Button variant='contained'>New Exam Project</Button>
          </Link>
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

export default ExamsProjectsPage;
