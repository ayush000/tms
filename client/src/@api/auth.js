import { instance, getParams } from './instance';

const handlePromise = (handler, callback) => (data) => {
  let newData = data;
  if (data.message) {
    newData = data.message;
  }
  if (data.response && data.response.data) {
    newData = data.response.data;
  }

  if (callback) {
    callback(newData);
  }
  return handler();
};

export const login = (params, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .post('login', getParams(params))
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};

export const register = (params, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .post('register', getParams(params))
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};
