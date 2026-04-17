import { Button, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Container, Link } from 'atoms';
import { useContext, useEffect, useState } from 'react';
import useFetch from 'hooks/use-fetch';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import DeleteForeverModal from 'components/modals/DeleteModal';
import axios from 'axios';
import { companyId, headers } from 'services/auth';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';
import { usersBreadcrumbsPage } from 'components/common/breadcrumbsList';
import { AuthContext } from 'store/auth-context';

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { policies } = useContext(AuthContext);
  const [selected, setSelected] = useState<any[]>([]);
  const { data, error, loading, setData } = useFetch<any[]>(
    `${process.env.REACT_APP_API_URL}/api/v1/accounts/company/${companyId}`,
    []
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(uiActions.ChangeBreadcrumb(usersBreadcrumbsPage));
  }, [dispatch]);

  const deleteHandler = async () => {
    try {
      await axios(
        `${process.env.REACT_APP_API_URL}/api/v1/accounts/${selected[0]}`,
        {
          method: 'DELETE',
          headers: headers,
        }
      );
      const newData = data.filter((i) => i.id !== selected[0]);
      setData(newData);
      setSelected([]);
    } catch (err) {
      console.error(err);
    }
    setOpen(false);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      valueGetter: (params) => params.row.role.desc || '',
    },
    { field: 'active', headerName: 'Active', flex: 1 },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const onDelete = () => {
          setOpen(true);
          // setOpen(params.row.id);
        };

        return (
          <Stack direction='row' spacing={2}>
            {policies?.usersUpdate && (
              <Link to={`${params.id}/edit`} decorated={false}>
                <Button variant='outlined' size='small'>
                  Edit
                </Button>
              </Link>
            )}
            {policies?.usersDelete && (
              <Button variant='outlined' size='small' onClick={onDelete}>
                Delete
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <Container size='large'>
      <Grid container justifyContent='space-between'>
        <Grid item>
          <Typography variant='h5'>Users</Typography>
        </Grid>
        {policies?.usersCreate && (
          <Grid item>
            <Link to='/company/users/new' decorated={false}>
              <Button variant='contained'>New User</Button>
            </Link>
          </Grid>
        )}
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
            rows={data}
          />
        </LoadingSpinnerWrapper>
      </Grid>
      <DeleteForeverModal
        open={!!open}
        handleClose={() => setOpen(false)}
        deleteHandler={deleteHandler}
      />
    </Container>
  );
};

export default UsersPage;
