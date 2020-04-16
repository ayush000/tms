import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

export const getParams = (param) => ({
  ...param,
});

export const instance = axios.create({
  baseURL,
});
