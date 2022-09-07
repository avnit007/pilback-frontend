import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const getSensorData = async (node) => {
    return await axios.get(`/${node}/sensors`);
};

const saveSensorData = async (data) => {
    return await axios.post("/sensor", data);
};

const deleteSensorData = async (id) => {
    return await axios.delete(`/sensor/${id}`);
};

export { getSensorData, saveSensorData, deleteSensorData }
