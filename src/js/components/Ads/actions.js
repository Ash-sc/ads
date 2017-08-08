/**
 * Created by ash on 22/05/2017.
 */
import {
  GET_ADS_LIST_REQUEST,
  GET_ADS_LIST_SUCCESS,
  GET_ADS_LIST_FAILURE,
  NEW_ADS_REQUEST,
  NEW_ADS_SUCCESS,
  NEW_ADS_FAILURE,
} from 'constants/sharedConstants';
import adsApi from 'utils/api/adsApi';

export function getAdsList() {
  return {
    types: [
      GET_ADS_LIST_REQUEST,
      GET_ADS_LIST_SUCCESS,
      GET_ADS_LIST_FAILURE,
    ],
    callAPI: () => adsApi.getAdsList(),
    payload: {},
  };
}

export function newAds(data) {
  return {
    types: [
      NEW_ADS_REQUEST,
      NEW_ADS_SUCCESS,
      NEW_ADS_FAILURE,
    ],
    callAPI: () => adsApi.newAds(data),
    payload: {},
  };
}
