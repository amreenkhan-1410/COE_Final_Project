const axios = require('axios');

(async () => {
  try {
    const api = axios.create({ baseURL: 'http://localhost:8000' });
    const response = await api.post('/recommendation/', { basket: ['Bread'] });
    console.log('response:', response.data);
  } catch (err) {
    console.error('error:', err.message);
    if (err.response) {
      console.error('status', err.response.status);
      console.error('data', err.response.data);
    }
  }
})();