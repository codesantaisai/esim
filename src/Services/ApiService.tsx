/* eslint-disable prettier/prettier */
import axios from 'axios';

export default class ApiService {
  async getProduct() {
    const ax = await this.ax();
    return await ax.get('/posts');
  }
  async getImage() {
    const ax = await this.ax();
    return await ax.get('/list');
  }


  async ax() {
    const API_URL = 'https://picsum.photos/v2';
    const CONSUMER_KEY = 'ck_cb72230520df05cba55821827cc733ae9b9f0f14';
    const CONSUMER_SECRET = 'cs_f885f18f4b565742ff16ed71a01dd705bfca8c7d';

    return axios.create({
      baseURL: API_URL,
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET,
      },
    });
  }
}
