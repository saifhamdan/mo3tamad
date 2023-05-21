import ConfirmationModal from 'components/modals/ConfirmationModal';

interface Props {
  open: boolean;
  handleClose: () => void;
  deleteHandler: () => void;
  item: any;
}

const DeleteForeverModal: React.FC<Props> = (props) => {
  return (
    <ConfirmationModal
      open={props.open}
      closeHandler={props.handleClose}
      actionHandler={props.deleteHandler}
      headerText={'Delete forever'}
      bodyText={`Are you sure you want to delete "${
        props?.item?.name || props?.item?.desc
      }"?`}
      confirmButtonText='delete'
      cancelButtonText='cancel'
    />
  );
};

export default DeleteForeverModal;
