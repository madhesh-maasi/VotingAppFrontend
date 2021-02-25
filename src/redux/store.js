import thunkMiddleware from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { loginReducer } from './reducer';
import { loadState, saveState } from './localstorage'

const rootReducer = combineReducers({
  loginReducer: loginReducer,
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware)
);
