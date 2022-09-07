import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const getNodeData = async (site) => {
    return await axios.get(`/${site}/nodes`);
};

const saveNodeData = async (data) => {
    return await axios.post("/node", data);
};

const deleteNodeData = async (id) => {
    return await axios.delete(`/node/${id}`);
};

export { getNodeData, saveNodeData, deleteNodeData }
