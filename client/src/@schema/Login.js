import { object, string } from 'yup';

export const loginSchema = object({
  email: string().required('Please enter email'),
  password: string().required('Please enter password'),
});
