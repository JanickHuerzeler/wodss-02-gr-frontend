import React from 'react';
import ReactDOM from 'react-dom';

import './scss/index.scss';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';

/**
 * Main loader for app
 */
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
