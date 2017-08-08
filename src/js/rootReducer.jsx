import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import popupReducer from 'components/_shared/Popup/reducer';
import loginReducer from 'components/_shared/Login/reducer';
import adsReducer from 'components/Ads/reducer';

// Reducer
export const rootReducer = combineReducers({
  routing: routerReducer,
  _shared: combineReducers({
    popup: popupReducer,
    login: loginReducer,
  }),
  ads: adsReducer,
});
