/**
 * Created by ash on 22/05/2017.
 */
import {
  GET_ADS_LIST_REQUEST,
  GET_ADS_LIST_SUCCESS,
  GET_ADS_LIST_FAILURE,
} from 'constants/articleConstants';

// Initial state
export const initialState = {
  status: 'ok',
  adsList: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_ADS_LIST_REQUEST:
    case GET_ADS_LIST_FAILURE: {
      return { ...state, ...{ status: action.status, adsList: [] } };
    }
    case GET_ADS_LIST_SUCCESS: {
      return { ...state, ...{ status: action.status, adsList: action.data } };
    }
    default:
      return state;
  }
}
