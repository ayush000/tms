import React, { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const useModal = () => {
  const [content, setContent] = useState(null);
  const loadModal = (modalContent) => setContent(modalContent);

  return {
    content,
    loadModal,
  };
};

export const ModalContainer = createContainer(useModal);

const ModalBase = () => {
  const { content } = ModalContainer.useContainer();
  const [show, setShow] = useState(false);

  const closeModal = () => {
    setShow(false);
    if (content.onClose) {
      content.onClose();
    }
  };

  const onSubmit = () => {
    if (content.onSubmit) {
      content.onSubmit();
    }
    setShow(false);
  };

  useEffect(() => {
    if (content) {
      setShow(true);
    }
  }, [content]);

  return content ? (
    <Modal show={show} onHide={closeModal} size="lg">
      {content.header && (
        <Modal.Header closeButton>{content.header}</Modal.Header>
      )}
      <Modal.Body>{content.body(closeModal)}</Modal.Body>
      {content.type !== 'form' && (
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  ) : null;
};

export default ModalBase;
