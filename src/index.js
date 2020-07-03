import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import thunk from 'redux-thunk';
import {createStore,applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
// import tasks from './reducers';
import logger from './middleware/logger';
import analytics from './middleware/analytics';
import apiMiddleware from './middleware/api';

import {composeWithDevTools} from 'redux-devtools-extension';

import tasksReducer from './reducers';
const rootReducer = (state={},action)=>{
  return {
    tasks: tasksReducer(state.tasks,action),
  };
};

// const store = createStore(tasks,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// const store = createStore(tasks,applyMiddleware(thunk))
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk,apiMiddleware,logger,analytics)),
)
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
