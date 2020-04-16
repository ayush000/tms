import jwtDecode from 'jwt-decode';
import moment from 'moment';

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  BASIC: 'BASIC',
};

const TOKEN = 'token';

export const isLoggedIn = () => {
  const userProfile = getUserProfile();

  return userProfile && moment.unix(userProfile.exp) > new Date();
};

export const loginSetup = (jwtToken) => {
  localStorage.setItem(TOKEN, jwtToken);
};

export const logout = () => {
  localStorage.clear();
};

export const getToken = () => localStorage.getItem(TOKEN);

export const getUserProfile = () => {
  const jwtToken = getToken();

  if (!jwtToken) {
    return null;
  }

  return jwtDecode(jwtToken);
};
