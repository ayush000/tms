import { instance, getParams } from './instance';
import { getToken } from '@utils/auth';

// To set the Authorization token to axios instance
instance.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;

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

export const getUsers = (params, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .get('users', { params: getParams(params) })
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};

export const createUser = (params, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .post('users/create', getParams(params))
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};

export const editUser = (id, params, success, failure) => {
  delete params['confirmPassword'];
  delete params['updatedAt'];
  return new Promise((resolve, reject) => {
    instance
      .put(`users/${id}`, getParams(params))
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};

export const deleteUser = (id, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .delete(`users/${id}`)
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};

export const getUser = (id, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .get(`users/${id}`)
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};
