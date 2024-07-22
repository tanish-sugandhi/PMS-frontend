import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/goals';
// const token = JSON.parse(localStorage.getItem("token"));

//To get goals of a user
const getUserGoals = async (token, userId) => {

  return await axios.get(`${API_BASE_URL}/user/${userId}`, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => res.data)
    .then(data => data.sort((a, b) => new Date(b.setDate) - new Date(a.setDate)))
    .catch(err => console.log(err));
};
//To save personal goals
const savePersonalGoal = async (token, goal, userId) => {
  return await axios.post(`${API_BASE_URL}/addPersonal/${userId}`,
    {
      'goalId': null,
      'goalName': goal.goalName,
      'description': goal.description,
      'goalType': goal.goalType,
      'measurable': goal.measurable,
      'endDate': goal.endDate,
      'userId': userId,
      'setDate': null,
      'goalStatus': 'CREATED'
    },
    { headers: { "Authorization": `Bearer ${token}` } },
  )
    .then(res => res.data)
    .catch(err => { throw new Error(err) });
  // alert("Saved data");
  // navigate('/goals');
};

const saveOrganisationalGoal = async (goal, userId, managerId) => {
  const token = JSON.parse(localStorage.getItem("token")).token;
  return await axios.post(`${API_BASE_URL}/addOrganisational/${managerId}`, {
    'goalName': goal.goalName,
    'description': goal.description,
    'goalType': goal.goalType,
    'measurable': goal.measurable,
    'endDate': goal.endDate,
    'userId': userId,
    'goalStatus': 'CREATED'
  },
    { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => res.data)
    .catch(err => console.log(err));
}

const deleteGoal = async (token, goalId) => {
  return axios.delete(`${API_BASE_URL}/delete/${goalId}`, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => console.log(res))
    .catch(err => err);
};

const updateGoalService = async (token, values, goal) => {
  // console.log(values);
  // console.log(goal);
  return await axios.put(`${API_BASE_URL}/update/${values.goalId}`, {
    'goalId': values.goalId,
    'goalName': goal.goalName,
    'description': goal.description,
    'goalType': goal.goalType,
    'measurable': goal.measurable,
    'endDate': values.endDate,
    'userId': values.userId,
    'setDate': values.setDate,
    'goalStatus': goal.goalStatus
  }, { headers: { "Authorization": `Bearer ${token}` } },

  )
    .then(res => res.data)
    .catch(err => err);
}

export { getUserGoals, savePersonalGoal, saveOrganisationalGoal, deleteGoal, updateGoalService }