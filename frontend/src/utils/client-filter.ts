interface ConstantsProps {
  [key: string]: {
    search: string[];
    fields: string[];
  };
}
export type resourcesType = 'exams';

// whenever you want to use this method you have to add the resource here
export const filteringConstants: ConstantsProps = {
  exams: {
    search: ['name', 'desc'],
    fields: [],
  },
};

const filterColumn = (row: any, key: string, value: any) => {
  // if the field is string
  if (typeof row[key] === 'string') return row[key].startsWith(value);
  // if the field is array
  else if (Array.isArray(row[key]))
    return row[key].filter((val: any) => val.startsWith(value)).length > 0;
  // if the field is object
  else if (typeof row[key] === 'object') {
    return Object.entries(row[key]).some(
      (entry: any) => entry[1].startsWith(value).length > 0
    );
  }
};

const clientFilter: any = (
  search: string,
  fields: any,
  type: resourcesType,
  data: any
) => {
  // filtering using using select for ex
  const filteredUsingFields = data.filter((row: any) => {
    let flag = true;
    filteringConstants[type].fields.forEach((key: string) => {
      if (fields[key]) {
        if (key === 'category') {
          flag =
            flag &&
            filterColumn(
              row,
              key,
              fields['major']
                ? `${fields['category']}-${fields['major']}`
                : fields[key]
            );
        } else flag = flag && filterColumn(row, key, fields[key]);
      }
    });
    return flag;
  });

  // filtering using search box for ex
  const filteredData = filteredUsingFields.filter((row: any) =>
    filteringConstants[type].search.some((column) => {
      if (Array.isArray(row[column])) {
        return row[column].some(
          (key: string) => key.toLowerCase().indexOf(search.toLowerCase()) > -1
        );
      } else if (typeof row[column] === 'object') {
        return Object.entries(row[column]).some(
          (entry: any) =>
            entry[1].toString().toLowerCase().indexOf(search.toLowerCase()) > -1
        );
      } else
        return (
          row[column].toString().toLowerCase().indexOf(search.toLowerCase()) >
          -1
        );
    })
  );

  return filteredData;
};

export default clientFilter;
