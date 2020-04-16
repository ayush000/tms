import React, { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import styled from 'styled-components';
import Toast from 'react-bootstrap/Toast';

const useToast = () => {
  const [content, setContent] = useState(null);
  const loadToaster = (toasterContent) => setContent(toasterContent);

  return {
    content,
    loadToaster,
  };
};

export const ToasterContainer = createContainer(useToast);

const Toaster = () => {
  const { content } = ToasterContainer.useContainer();
  const [show, setShow] = useState(false);

  const closeToaster = () => {
    setShow(false);
    if (content.onClose) {
      content.onClose();
    }
  };

  useEffect(() => {
    if (content) {
      setShow(true);
    }
  }, [content]);

  return content ? (
    <ToasterWrapper aria-live="polite" aria-atomic="true" state={content.state}>
      <Toast
        onClose={closeToaster}
        show={show}
        delay={content.delay || 2000}
        autohide
      >
        <Toast.Body>
          {typeof content.body === 'object' ? content.body.message : content.body}
        </Toast.Body>
      </Toast>
    </ToasterWrapper>
  ) : null;
};

export default Toaster;

const ToasterWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  top: 30px;
  width: 100%;

  .toast {
    max-width: 450px;
    margin: 0 auto;

    &-body {
      background-color: ${(props) =>
        props.state === 'ERROR' ? '#ff0000' : '#4ca361'};
      color: #ffffff;
      font-weight: 500;
      text-align: center;
    }
  }
`;
