import { object, string, ref } from 'yup';

export const registerSchema = object({
  firstName: string().required('Please enter first name'),
  lastName: string().required('Please enter last name'),
  employeeId: string().required('Please enter an employee ID'),
  email: string()
    .email('Please enter valid email')
    .required('Please enter email'),
  password: string().required('Please enter password'),
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords do not match')
    .required('Please confirm password'),
});
