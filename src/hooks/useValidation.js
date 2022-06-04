import _ from 'lodash';
import * as yup from 'yup';

export const useValidation = params => {
  let schemaObj = {
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email address is required'),
    jobTitle: yup.string().required('Job title is required'),
    salary: yup.string().required('Salary is required'),
  };

  if (Array.isArray(params)) {
    schemaObj = _.pick(schemaObj, params);
  }

  const validationSchema = yup.object().shape(schemaObj);

  return validationSchema;
};
