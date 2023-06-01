import { useEffect, useState } from 'react';

import { Button, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Container, Link } from 'atoms';
import useFetch from 'hooks/use-fetch';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import { companyId, headers } from 'services/auth';
import { examsProjectsBreadcrumbsPage } from 'components/common/breadcrumbsList';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';
import DeleteForeverModal from 'components/modals/DeleteModal';
import axios from 'axios';

const ExamsProjectsPage = () => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const { data, error, loading, setData } = useFetch<any[]>(
    `${process.env.REACT_APP_API_URL}/api/v1/exams/company/${companyId}`,
    []
  );

  const onDeleteHandler = async () => {
    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/exams/${selected[0]}`,
        headers: headers,
        method: 'DELETE',
      });
      console.log(selected);
      const newData = data.filter((d: any) => d.id !== selected[0]);
      setData(newData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(uiActions.ChangeBreadcrumb(examsProjectsBreadcrumbsPage));
  }, [dispatch]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Title', flex: 1 },
    { field: 'passingScore', headerName: 'Passing score', flex: 1 },
    { field: 'duration', headerName: 'Duration', flex: 1 },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 2,
      sortable: false,
      renderCell: (params) => {
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
            <Link to={`${params.id}/edit`} decorated={false}>
              <Button variant='outlined' size='small'>
                Edit
              </Button>
            </Link>
            <Button
              variant='outlined'
              size='small'
              onClick={() => setOpen(true)}
            >
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
      <DeleteForeverModal
        open={open}
        deleteHandler={onDeleteHandler}
        handleClose={() => setOpen(false)}
      />
    </Container>
  );
};

export default ExamsProjectsPage;
