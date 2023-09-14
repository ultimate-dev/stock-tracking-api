import * as _ from 'lodash';

const queryGenerator = (query_name, query_value, query_id) => {
  let result = {};
  if (query_name) {
    _.set(result, query_name, query_value || parseInt(query_id));
  }
  return result;
};

export default { queryGenerator };
