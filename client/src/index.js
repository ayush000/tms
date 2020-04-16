import React from 'react';
import { render } from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ModalBase, ModalContainer } from '@components/Modal';
import { Toaster, ToasterContainer } from '@components/Toaster';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table-v6/react-table.css';

render(
  <ModalContainer.Provider>
    <ToasterContainer.Provider>
      <App />
      <Toaster />
      <ModalBase />
    </ToasterContainer.Provider>
  </ModalContainer.Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
