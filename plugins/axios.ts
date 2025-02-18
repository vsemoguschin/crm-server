import axios, { AxiosError } from 'axios';

const baseURL = 'https://easy-crm.pro/api/';

// Создаем экземпляр Axios
const useApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Логирование ошибок
function handleError(error: AxiosError) {
  console.error('Произошла ошибка:', error);
  if (error.response) {
    console.error('Статус ошибки:', error.response.status);
    console.error('Данные ошибки:', error.response.data);
  } else if (error.request) {
    console.error('Нет ответа от сервера:', error.request);
  } else {
    console.error('Ошибка при настройке запроса:', error.message);
  }
}

// Перехватчик запросов: добавляем токен
useApi.interceptors.request.use(
  (request) => {
    const accessToken = process.env.ACCESS_TOKEN || ''; // Используем переменные окружения
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      console.warn('Токен отсутствует.');
    }
    return request;
  },
  (error) => {
    handleError(error);
    return Promise.reject(error);
  },
);

// Перехватчик ответов: обработка 401 и обновление токена
useApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    handleError(error);
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = process.env.REFRESH_TOKEN || '';
        const { data } = await axios.post(
          `${baseURL}/auth/refresh/`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        );
        process.env.ACCESS_TOKEN = data.access; // Обновляем токен в переменных окружения
        process.env.REFRESH_TOKEN = data.refreshToken;

        return useApi(originalRequest); // Повторяем запрос с новым токеном
      } catch (refreshError) {
        handleError(refreshError as AxiosError);
        delete process.env.ACCESS_TOKEN;
        delete process.env.REFRESH_TOKEN;
        throw refreshError;
      }
    }
    return Promise.reject(error);
  },
);

export default useApi;
