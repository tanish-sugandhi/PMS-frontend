import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from "react-redux";
import Store from "./components/redux/Store.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <BrowserRouter>
    <GoogleOAuthProvider clientId="789075636203-9loq49mt0j7mdsjeqoej8jsbogua9uuf.apps.googleusercontent.com"> 
    <Provider store={Store}>
      <App />
      </Provider>
    </GoogleOAuthProvider>,
  </BrowserRouter>
  
);
reportWebVitals();
