import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const getPayloadData = async (sensor) => {
    return await axios.get(`/${sensor}/payloads`);
};

const savePayloadData = async (data) => {
    return await axios.post("/payload", data);
};

const deletePayloadData = async (id) => {
    return await axios.delete(`/payload/${id}`);
};

export { getPayloadData, savePayloadData, deletePayloadData }
