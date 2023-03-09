import React from 'react';
import App from './App';
import {Provider} from 'react-redux';
import {store} from './src/redux/store/store';

const Root = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default Root;
