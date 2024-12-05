import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AccountProvider} from "./views/providers/AccountProvider"
import { DataProvider } from './views/providers/DataProvider';
import { NewDataProvider } from './providers/DataProvider';
import { store } from './redux/Store';
//SERVICES
import { AxiosInterceptor } from './services/interceptor';

const root = ReactDOM.createRoot(document.getElementById('root'));

AxiosInterceptor();

root.render(
  <AccountProvider>
  <DataProvider>
  <NewDataProvider>
  <Provider store={store}>
    <App/>
  </Provider>
  </NewDataProvider>
  </DataProvider>
  </AccountProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

/*
<React.StrictMode>
*/
reportWebVitals();
