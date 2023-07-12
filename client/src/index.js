import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import store from './redux/store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider
    store={store}
  >
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#331D2C',
        colorBorder: '#331D2C',
      }
    }}>
      <App />
    </ConfigProvider>
  </Provider>

);

reportWebVitals();
