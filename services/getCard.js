// services/kaitenService.js
const axios = require('axios');

// Получите токен из переменных окружения или другого источника
const getToken = () => {
  console.log(process.env.KAITEN_API_TOKEN, 213132312);
  return process.env.KAITEN_API_TOKEN; // Убедитесь, что токен установлен в .env файле
};

module.exports = async (id) => {
  try {
    const response = await axios.get(`https://easyneonwork.kaiten.ru/api/latest/cards/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    return console.error('Error fetching data from Kaiten:');
    // throw error;
  }
};
