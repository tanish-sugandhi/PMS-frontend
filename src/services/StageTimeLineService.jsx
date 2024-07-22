import axios from 'axios';

const API_URL = 'http://localhost:8080/api/stages';

const getToken = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    return token ? token.token : null;
};

const getTimelineCycleData = async () => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
    // // current cycle id
    // const id = await axios.get(`${API_URL}/timelineCycle/fetchId`, {
        //     headers: { "Authorization": `Bearer ${token}` }
        // }).then(response => response?.data).error(err => console.log(err));
        
        // current cycle data
        return await axios.get(`${API_URL}/timelineCycle/all`, {
            headers: { "Authorization": `Bearer ${token}` }
        }).then(response => response?.data).catch(err => console.log(err));
}


const saveStage = async (stageData) => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await axios.post(`${API_URL}/create`, stageData, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error saving stage:', error);
        throw error;
    }
};
const updateStage = async (timelineId, stageData) => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await axios.put(`${API_URL}/update/${timelineId}`, stageData, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating stage:', error);
        throw error;
    }
};
const getAllStagesWithTimeline = async () => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await axios.get(`${API_URL}/timeline/all`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stages with timeline:', error);
        throw error;
    }
};

const getStageWithTimelineByName = async (stageName) => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await axios.get(`${API_URL}/timelines/${stageName}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stage by name:', error);
        throw error;
    }
};

const getTimelinesByDate = async (currentDateTime) => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await axios.get(`${API_URL}/byDate`, {
            params: { currentDateTime },
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching timelines by date:', error);
        throw error;
    }
};

export default {
    saveStage,
    updateStage,
    getAllStagesWithTimeline,
    getStageWithTimelineByName,
    getTimelinesByDate,
    getTimelineCycleData
};