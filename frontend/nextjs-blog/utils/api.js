import axios from 'axios';

const API_URL = 'http://localhost:1337/api'; // Update with your Strapi URL

export const signUp = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/user-accs`, {
        "data": {
                "Username": `${username}`,
              }
        }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const login = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/user-accs?filters[Username][$eqi]=${username}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Login response:', response.data); // Add this line for debugging
    if (response.data && response.data.data.length > 0) {
      return response.data.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error;
  }
};
