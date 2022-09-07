import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const getCoreData = async () => {
    return await axios.get("/sites");
};

const saveCoreData = async (data) => {
    return await axios.post("/site", data);
};

const deleteCoreData = async (id) => {
    return await axios.delete(`/site/${id}`);
};

export { getCoreData, saveCoreData, deleteCoreData }
