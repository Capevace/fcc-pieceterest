import { createStore, combineReducers } from 'redux';
import auth from './reducers/auth';
import loading from './reducers/loading';
import modalOpen from './reducers/modalOpen';

export default createStore(
  combineReducers({
    auth,
    loading,
    modalOpen
  })
);
