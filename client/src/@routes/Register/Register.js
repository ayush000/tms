import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { Button, Form, Col, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { register } from '@api/auth';
import { ToasterContainer } from '@components/Toaster';
import { registerSchema } from '@schema/Register';
import { isLoggedIn } from '@utils/auth';

const Register = () => {
  const history = useHistory();
  const { loadToaster } = ToasterContainer.useContainer();

  const handleSubmit = (values) => {
    const success = (data) => {
      history.push('/');
    };

    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };

    register(values, success, failure);
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (isLoggedIn()) {
      history.push('/');
    }
  }, [history]);

  return (
    <RegisterWrapper>
      <Card>
        <Card.Header>Register</Card.Header>
        <Card.Body>
          <Form
            name="registerForm"
            autoComplete="off"
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <Form.Row>
              <Form.Group as={Col} controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={
                    formik.touched.firstName && !!formik.errors.firstName
                  }
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
                  isInvalid={
                    formik.touched.lastName && !!formik.errors.lastName
                  }
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
                type="text"
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
                isInvalid={
                  formik.touched.employeeId && !!formik.errors.employeeId
                }
                {...formik.getFieldProps('employeeId')}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.employeeId}
              </Form.Control.Feedback>
            </Form.Group>

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
                  formik.touched.confirmPassword &&
                  !!formik.errors.confirmPassword
                }
                {...formik.getFieldProps('confirmPassword')}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </RegisterWrapper>
  );
};

export default Register;

const RegisterWrapper = styled.div`
  max-width: 768px;
  margin: 100px auto;

  .card-header {
    text-align: center;
  }
`;
