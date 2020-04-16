import { object, string, ref } from 'yup';
import { ROLES } from '@utils/auth';
import { durationFormRegExp } from '@utils/common';

export const createUserSchema = object({
  firstName: string().required('Please enter first name'),
  lastName: string().required('Please enter last name'),
  employeeId: string().required('Please enter an employee ID'),
  email: string()
    .email('Please enter valid email')
    .required('Please enter email'),
  role: string()
    .oneOf([ROLES.ADMIN, ROLES.MANAGER, ROLES.BASIC])
    .required('Please specify role'),
  preferredWorkingHourPerDay: string()
    .matches(durationFormRegExp, 'Please enter valid value')
    .nullable(),
  password: string().required('Please enter password'),
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords do not match')
    .required('Please confirm password'),
});
