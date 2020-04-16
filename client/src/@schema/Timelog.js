import { object, string, date } from 'yup';
import { durationFormRegExp } from '@utils/common';

export const timelogSchema = object({
  notes: string()
    .required('Please enter note')
    .max(2000, 'Note cannot be more than 2000 characters'),
  loggedAt: date().required('Please enter a valid date'),
  duration: string().matches(durationFormRegExp, 'Please enter valid value'),
});
