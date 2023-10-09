import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './components/App';
import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root");
const reactRoot = createRoot(root);

reactRoot.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // document.getElementById("root")
);
