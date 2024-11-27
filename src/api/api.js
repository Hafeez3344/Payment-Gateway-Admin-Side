import axios from "axios";

const BACKEND_URL = "http://localhost:8888";

export const fn_loginAdminApi = async (data) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/admin/login`, data);
        return { status: true, message: "Admin Logged in successfully", token: response?.data?.token };
    } catch (error) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
}