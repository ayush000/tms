import { useFormik } from 'formik';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

import { createUser, editUser } from '@api/user';
import { createUserSchema } from '@schema/User';
import { ROLES } from '@utils/auth';
import { ToasterContainer } from '@components/Toaster';
import { durationToMinutes, getDuration } from '@utils/common';

const CreateUserForm = ({ user, history, closeModal }) => {
  const { loadToaster } = ToasterContainer.useContainer();

  const handleSubmit = (values) => {
    const success = (data) => {
      closeModal();
      loadToaster({ state: 'SUCCESS', body: data.message });
      history.push('/');
    };
    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };
    if (user) {
      editUser(
        user.id,
        {
          ...values,
          preferredWorkingHourPerDay:
            durationToMinutes(values.preferredWorkingHourPerDay) || null,
        },
        success,
        failure
      );
    } else {
      createUser(
        {
          ...values,
          preferredWorkingHourPerDay:
            durationToMinutes(values.preferredWorkingHourPerDay) || null,
        },
        success,
        failure
      );
    }
  };

  const formik = useFormik({
    initialValues: !user
      ? {
          firstName: '',
          lastName: '',
          employeeId: '',
          email: '',
          role: ROLES.BASIC,
          preferredWorkingHourPerDay: '',
          password: '',
          confirmPassword: '',
        }
      : {
          ...user,
          confirmPassword: '',
          preferredWorkingHourPerDay:
            user && user.preferredWorkingHourPerDay
              ? getDuration(user.preferredWorkingHourPerDay)
              : '',
        },
    validationSchema: createUserSchema,
    onSubmit: handleSubmit,
  });

  return (
    <CreateUserFormWrapper>
      <Form
        name="createUserForm"
        autoComplete="off"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <Form.Row>
          <Form.Group as={Col} controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              isInvalid={formik.touched.firstName && !!formik.errors.firstName}
              {...formik.getFieldProps('firstName')}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              isInvalid={formik.touched.lastName && !!formik.errors.lastName}
              {...formik.getFieldProps('lastName')}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            isInvalid={formik.touched.email && !!formik.errors.email}
            {...formik.getFieldProps('email')}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="employeeId">
          <Form.Label>Employee ID</Form.Label>
          <Form.Control
            type="text"
            disabled={!!user}
            isInvalid={formik.touched.employeeId && !!formik.errors.employeeId}
            {...formik.getFieldProps('employeeId')}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.employeeId}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col} controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              isInvalid={!!formik.errors.role}
              {...formik.getFieldProps('role')}
              disabled={!!user}
            >
              {[ROLES.ADMIN, ROLES.MANAGER, ROLES.BASIC].map((role) => (
                <option key={`role_${role}`}>{role}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formik.errors.role}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="preferredWorkingHourPerDay">
            <Form.Label>Preferred Working Hours per Day</Form.Label>
            <Form.Control
              type="text"
              disabled={formik.values.role !== ROLES.BASIC}
              isInvalid={
                formik.touched.preferredWorkingHourPerDay &&
                !!formik.errors.preferredWorkingHourPerDay
              }
              {...formik.getFieldProps('preferredWorkingHourPerDay')}
              placeholder="ex: 6H3M for 6 hours 3 minutes"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.preferredWorkingHourPerDay}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            autoComplete="new-password"
            type="password"
            isInvalid={formik.touched.password && !!formik.errors.password}
            {...formik.getFieldProps('password')}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            isInvalid={
              formik.touched.confirmPassword && !!formik.errors.confirmPassword
            }
            {...formik.getFieldProps('confirmPassword')}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          {!!user ? 'Save Changes' : 'Create User'}
        </Button>
      </Form>
    </CreateUserFormWrapper>
  );
};

export default CreateUserForm;

const CreateUserFormWrapper = styled.div`
  padding: 20px;
`;
