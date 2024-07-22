import axios from 'axios';
const API_URL = 'http://localhost:8080/api/user';

const getAllUsers = async (token) => {
console.log("token ::::::: "+token);
    return await axios.get(`${API_URL}/getAll`, { headers: { "Authorization": `Bearer ${token}` } }).then(res => res).catch(err => console.log(err));
};

const getAllUsersWithManagerEmail = async (token) => {
    return await axios.get(`${API_URL}/getAllUsers`, { headers: { "Authorization": `Bearer ${token}` } }).then(res=>res).catch(err=>console.log(err));
};

const updateAboutMe = async (token, email, aboutMe) => {
    return await axios.post(`${API_URL}/about/${email}`, { aboutMe }, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => res.data)
        .catch(err => console.log(err));
};

const changePassword = async (token, email, oldPassword, newPassword, confirmPassword) => {
    const data = {
        oldPassword,
        newPassword,
        confirmPassword
    };
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
    return await axios.post(`${API_URL}/changePassword/${email}`, data, { headers })
        .then(res => res.data)
        .catch(err => {
            console.error('API call error:', err);
            throw err;
        });
};
const getUserById = async (token, userId) => {
    return await axios.get(`${API_URL}/getByEmpId/${userId}`, { headers: { "Authorization": `Bearer ${token}` } }).then(res => res).catch(err => { throw new Error(err) });
};

const getByEmployeesUnderMe = async(token, userId)=>{
    const token1 = JSON.parse(localStorage.getItem("token"))?.token;
    return await axios.get(`${API_URL}/managerEmployee/${userId}`,{headers:{"Authorization":`Bearer ${(token1)?token1:token}`}})
    .then(res=>res.data).catch(err=>console.log(err));
}

const getAllActiveUserEmails = async (token) => {
    return await axios.get(`${API_URL}/active-emails`, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => res.data)
        .catch(err => {
            console.error('API call error:', err);
            throw err;
        });
};
export default {
    getAllUsers,
    getAllUsersWithManagerEmail,
    getUserById,
    updateAboutMe,
    changePassword,
    getByEmployeesUnderMe,
    getAllActiveUserEmails,
};
