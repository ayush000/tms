import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { login } from '@api/auth';
import { ToasterContainer } from '@components/Toaster';
import { loginSchema } from '@schema/Login';
import { isLoggedIn, loginSetup } from '@utils/auth';

const Login = () => {
  const history = useHistory();
  const { loadToaster } = ToasterContainer.useContainer();

  const handleSubmit = ({ email, password }) => {
    const success = (data) => {
      loginSetup(data);
      history.push('/');
    };

    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };

    login({ email, password }, success, failure);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (isLoggedIn()) {
      history.push('/');
    }
  }, [history]);

  return (
    <LoginWrapper>
      <Card>
        <Card.Header>Login to Time Management System</Card.Header>
        <Card.Body>
          <Form
            name="loginForm"
            autoComplete="off"
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="text"
                isInvalid={formik.touched.email && !!formik.errors.email}
                {...formik.getFieldProps('email')}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                isInvalid={formik.touched.password && !!formik.errors.password}
                {...formik.getFieldProps('password')}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Log In
            </Button>
            <Link to="/register">New User? Register.</Link>
          </Form>
        </Card.Body>
      </Card>
    </LoginWrapper>
  );
};

export default Login;

const LoginWrapper = styled.div`
  max-width: 320px;
  margin: 100px auto;

  a {
    display: block;
    margin: 25px 0 0;
    text-decoration: none;
  }

  .card-header {
    text-align: center;
  }
`;
