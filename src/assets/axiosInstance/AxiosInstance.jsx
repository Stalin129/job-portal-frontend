import axios from "axios";
const api = axios.create({
    baseURL: ""
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
);
let sessionExpiredHandled = false;
api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        if (error.response?.status === 401&&
            error.response?.data === "TOKEN_EXPIRED"&&!sessionExpiredHandled
        ) {
            sessionExpiredHandled=true;
            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            alert("Session expired. Please login again.");

            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;