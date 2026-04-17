const mapObj = (data: any) => {
  const obj: any = {};
  Object.entries(data).forEach((en) => {
    const key = en[0].split('_');
    const newKey = key.reduce((prev, curr, i) => {
      if (i === 0) return curr;
      return prev + curr.charAt(0).toUpperCase() + curr.slice(1);
    }, '');
    obj[newKey] = en[1];
  });
  return obj;
};

export const httpMapper = <T>(data: any): T => {
  if (typeof data === 'object') {
    if (data.length != null) {
      return data.map((o: any) => mapObj(o));
    }
    return mapObj(data);
  }
  return data;
};

// testing
// const userd = {
//   user_id: 1,
// };

// const user = httpMapper<Account>(userd);
