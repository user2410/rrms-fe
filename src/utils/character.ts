import _ from 'lodash';

export const Camelize = (obj: Object) => _.transform(obj, (acc: any, value, key, target) => {
  const camelKey = _.isArray(target) ? key : _.camelCase(key);
  
  acc[camelKey] = _.isObject(value) ? Camelize(value) : value;
});
