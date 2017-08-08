/**
 * Created by ash on 22/05/2017.
 */
import Api from './api';

export default class adsApi {

  static getAdsList() {
    return Api.get('/getAdsList');
  }
}
