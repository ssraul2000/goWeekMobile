import axios from "axios";
const api = axios.create({
  baseURL: "https://backendgoweek6.herokuapp.com"
});

export default api;
