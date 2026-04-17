import { useState } from 'react';
import clientFilter, { resourcesType } from 'utils/client-filter';

const useFilter = (initState: object, resource: resourcesType, data: any[]) => {
  const maxPages = 9;
  const [filter, setFilter] = useState<any>(initState);
  const [page, setPage] = useState(1);

  const filterHandler = (key: string, value: string) => {
    const newFilter = { ...filter };
    newFilter[key] = value;
    setFilter(newFilter);
    setPage(1);
  };

  const pageHandler = (type: 'dec' | 'inc') => {
    setPage(page + (type === 'inc' ? 1 : -1));
  };

  const filteredData = clientFilter(
    filter?.search,
    { ...filter },
    resource,
    data
  );

  const firstItem = maxPages * (page - 1);
  const lastItem = page * maxPages;
  const paginatedData = filteredData.slice(firstItem, lastItem);

  return {
    filter,
    page: paginatedData.length !== 0 ? page : 0,
    maxPages,
    filterHandler,
    pageHandler,
    data: paginatedData,
    count: filteredData.length,
    firstItem: paginatedData.length !== 0 ? firstItem + 1 : 0,
    lastItem: lastItem > filteredData.length ? filteredData.length : lastItem,
  };
};
export default useFilter;
