import { useEffect, useState } from 'react';

import { Button, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Container, Link } from 'atoms';
import useFetch from 'hooks/use-fetch';
import LoadingSpinnerWrapper from 'utils/loading-spinner-wrapper';
import { examProjectQuestionsBreadcrumbsPage } from 'components/common/breadcrumbsList';
import { useAppDispatch } from 'store';
import { uiActions } from 'store/ui-slice';
import { useParams } from 'react-router';
import DeleteForeverModal from 'components/modals/DeleteModal';
import { headers } from 'services/auth';
import axios from 'axios';

const ExamQuestionsPage = () => {
  let qsCounter = 1;
  let qsMapper: any = {};
  const dispatch = useAppDispatch();
  const { examId } = useParams();
  const [selected, setSelected] = useState<any[]>([]);
  const { data, error, loading, setData } = useFetch<any>(
    `${process.env.REACT_APP_API_URL}/api/v1/questions/byId/${examId}`,
    {}
  );
  const [open, setOpen] = useState(false);

  const onDeleteHandler = async () => {
    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/questions/${selected[0]}`,
        headers: headers,
        method: 'DELETE',
      });
      const newData = { ...data };
      newData.questions = [...newData.questions];
      newData.questions = newData.questions.filter(
        (d: any) => d.id !== selected[0]
      );
      setData(newData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(
      uiActions.ChangeBreadcrumb(examProjectQuestionsBreadcrumbsPage(data))
    );
  }, [dispatch, data]);

  const columns: GridColDef[] = [
    {
      field: 'text',
      headerName: 'Question',
      valueGetter: (params) => {
        if (!qsMapper[params.row.id]) {
          qsMapper[params.row.id] = qsCounter;
          qsCounter++;
        }
        return `Question: ${qsMapper[params.row.id]}`;
      },
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return (
          <Stack direction='row' spacing={2}>
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
          <Typography variant='h5'>Questions list</Typography>
        </Grid>
        <Grid item>
          <Link
            to={`/company/exams-projects/${examId}/questions/new`}
            decorated={false}
          >
            <Button variant='contained'>New Questions</Button>
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
            rows={data.questions ? data.questions : []}
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

export default ExamQuestionsPage;
