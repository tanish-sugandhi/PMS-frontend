import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/feedback';
// const token = JSON.parse(localStorage.getItem("token"));

//To get goals of a user
const getUserFeedback = async (token, userId) => {
  return await axios.get(`${API_BASE_URL}/user/${userId}`, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => res?.data)
    .catch(err => console.log('Failed to fetch user data! Error :' + err));
};  

//To set feedback
const saveUserFeedback = async(values) =>{
  const token = JSON.parse(localStorage.getItem("token"))?.token;
  return await axios.post(`${API_BASE_URL}/save`,values, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => res.data)
    .catch(err => console.log('Failed to add feedback data! Error :' + err));
}

export { getUserFeedback , saveUserFeedback}