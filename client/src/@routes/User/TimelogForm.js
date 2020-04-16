import { useFormik } from 'formik';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

import { createTimelog, editTimelog } from '@api/timelog';
import { ToasterContainer } from '@components/Toaster';
import { timelogSchema } from '@schema/Timelog';
import { durationToMinutes, getDuration } from '@utils/common';

const TimelogForm = ({ userId, timelog, closeModal }) => {
  const { loadToaster } = ToasterContainer.useContainer();

  const handleSubmit = (values) => {
    const success = (data) => {
      closeModal();
      loadToaster({ state: 'SUCCESS', body: data.message });
      window.location.reload();
    };
    const failure = (err) => {
      loadToaster({ state: 'ERROR', body: err || 'Error message' });
    };
    if (timelog) {
      editTimelog(
        userId,
        timelog.id,
        { ...values, duration: durationToMinutes(values.duration) },
        success,
        failure
      );
    } else {
      createTimelog(
        userId,
        { ...values, duration: durationToMinutes(values.duration) },
        success,
        failure
      );
    }
  };

  const formik = useFormik({
    initialValues: !timelog
      ? {
          loggedAt: new Date().toISOString(),
          duration: '',
          notes: '',
        }
      : { ...timelog, duration: getDuration(timelog.duration) },
    validationSchema: timelogSchema,
    onSubmit: handleSubmit,
  });

  return (
    <TimelogFormWrapper>
      <Form
        name="timelogForm"
        autoComplete="off"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <Form.Group controlId="loggedAt">
          <Form.Label>Logged At</Form.Label>
          <Form.Control
            type="text"
            isInvalid={formik.touched.loggedAt && !!formik.errors.loggedAt}
            {...formik.getFieldProps('loggedAt')}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.loggedAt}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="duration">
          <Form.Label>Duration</Form.Label>
          <Form.Control
            type="text"
            isInvalid={formik.touched.duration && !!formik.errors.duration}
            {...formik.getFieldProps('duration')}
            placeholder="ex: 6H3M for 6 hours 3 minutes"
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.duration}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="notes">
          <Form.Label>Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            isInvalid={formik.touched.notes && !!formik.errors.notes}
            {...formik.getFieldProps('notes')}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.notes}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Confirm
        </Button>
      </Form>
    </TimelogFormWrapper>
  );
};

export default TimelogForm;

const TimelogFormWrapper = styled.div`
  padding: 20px;
`;
