
import apiService from '../../services/apiService';

export const login = (loginData) => {
    return apiService.post('/user_profile/login', {
      username: loginData.username,
      password: loginData.password,
    });
  };
  

export const authenticateToken = (token) => {
  return apiService.post('/get_user_from_token', {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const logout = (navigate) => {
  sessionStorage.clear(); 
  navigate('/login'); 
};
