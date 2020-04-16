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

export const getTimelogs = (params, userId, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .get(`users/${userId}/timelogs`, { params: getParams(params) })
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};

export const getAggregatedTimelogs = (params, userId, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .get(`users/${userId}/timelogs/aggregated`, { params: getParams(params) })
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};

export const createTimelog = (userId, params, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .post(`users/${userId}/timelogs`, getParams(params))
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};

export const editTimelog = (userId, timelogId, params, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .put(`users/${userId}/timelogs/${timelogId}`, getParams(params))
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};

export const deleteTimelog = (userId, timelogId, success, failure) => {
  return new Promise((resolve, reject) => {
    instance
      .delete(`users/${userId}/timelogs/${timelogId}`)
      .then((response) => response.data)
      .then(handlePromise(resolve, success))
      .catch(handlePromise(reject, failure));
  });
};
