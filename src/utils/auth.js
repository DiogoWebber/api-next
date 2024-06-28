import axios from 'axios';
import jwt from 'jsonwebtoken';

export function setAuthHeader(token) {
  axios.defaults.headers.common['Authorization'] = `${token}`;
}

export const checkAuth = async () => {
  var userObj = null;

  if (typeof window === "undefined") {
    return { isValid: false };
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return { isValid: false };
  }

  try {
    setAuthHeader(token);
    const response = await axios.post('http://localhost:3001/auth/validate', '');
    if (response.status !== 200) {
      return { isValid: false };
    }

    const decodedToken = jwt.decode(token);
    if (decodedToken.user) {
      userObj = decodedToken.user;
    }

    return { isValid: true, userObj: userObj };
  } catch (error) {
    console.error('Token verification error:', error);
    return { isValid: false };
  }
};
