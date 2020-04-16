import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components';

const Loader = () => (
  <LoaderWrapper>
    <Overlay />
    <FontAwesomeIcon icon={faSpinner} spin />
  </LoaderWrapper>
);

export default Loader;

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;
