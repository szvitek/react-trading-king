import axios from 'axios';

const TOKEN = import.meta.env.VITE_API_KEY;

export default axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: {
    token: TOKEN,
  },
});
