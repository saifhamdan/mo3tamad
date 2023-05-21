import { Autocomplete, TextField } from '@mui/material';
import useFetch from 'hooks/use-fetch';

interface Props {
  multiple?: boolean;
  value: any[] | any;
  selectHandler: (item: any) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  url: string;
  label: string;
  name: string;
  error: string | undefined;
  dispalyFieldName: string;
}

const SelectGroup: React.FC<Props> = (props) => {
  const { value, error, multiple, label, dispalyFieldName } = props;
  const {
    data,
    loading,
    error: fetchError,
  } = useFetch<any[]>(props.url, null, {});

  let selected = null;
  if (data?.length > 0) {
    if (value?.length && typeof value === 'object') {
      selected = value.map((id: number | string) => {
        return data.find((i) => i.id === id);
      });
    } else {
      if (value) selected = data.find((i) => i.id === value);
    }
  }

  return (
    <Autocomplete
      multiple={multiple}
      id={label}
      value={selected}
      loading={loading}
      options={data && data.length > 0 ? data : []}
      onChange={(event: any, newValue: any) => {
        props.selectHandler(newValue);
      }}
      getOptionLabel={(option: any) => option[dispalyFieldName]}
      filterSelectedOptions
      renderInput={(params: any) => (
        <TextField
          {...params}
          label={label}
          placeholder={label}
          error={!!error || !!fetchError}
          helperText={error || fetchError}
          name={props.name}
          onBlur={props.onBlur}
          fullWidth
        />
      )}
    />
  );
};

export default SelectGroup;
