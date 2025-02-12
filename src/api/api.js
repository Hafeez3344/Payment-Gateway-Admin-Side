import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = "https://backend.royal247.org";
export const PDF_READ_URL = "https://pdf.royal247.org/parse-statement"
// const BACKEND_URL = "http://46.202.166.64:8000";
// export const BACKEND_URL = "http://192.168.1.18:8888"


export const fn_loginAdminApi = async (data) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/admin/login`, data);
        const token = response?.data?.token;
        const id = response?.data?.data?._id;

        return {
            status: true,
            message: "Admin Logged in successfully",
            token: token,
            id: id,
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_compareTransactions = async (data) => {
    try {
        const token = Cookies.get("token");

        const response = await axios.post(
            `${BACKEND_URL}/ledger/compare`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Compare API Response:", response?.data);

        return {
            status: true,
            message: "Transaction Verified",
            data: response.data?.data,
        };
    } catch (error) {
        if (error?.response) {
            console.error("Error during compare API:", error?.response?.data);
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        console.error("Network Error during compare API:", error);
        return { status: false, message: "Network Error" };
    }
};

export const fn_crateTransactionSlip = async (data) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/slip/create`, data);
        return {
            status: true,
            data: response.data?.data,
        };
    } catch (error) {
        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_showTransactionSlipData = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/slip/getAll`);
        return {
            status: true,
            data: response.data?.data,
        };
    } catch (error) {
        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_BankUpdate = async (id, data) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.post(`${BACKEND_URL}/bank/active?id=${id}&accountType=${data?.accountType}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            data: response.data,
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_getBankByAccountTypeApi = async (accountType) => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.get(`${BACKEND_URL}/bank/getAll?accountType=${accountType}`, // accountType="bank","upi"
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            data: response?.data,
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_getMerchantData = async () => {
    try {
        const token = Cookies.get("merchantToken");
        const merchantId = Cookies.get("merchantId");
        const response = await axios.get(`${BACKEND_URL}/merchant/get/${merchantId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return {
            status: true,
            data: response.data,
        };
    } catch (error) {
        return { status: false, message: "Network Error" };
    }
};

export const fn_getAllBanksData = async (accountType) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BACKEND_URL}/bank/getAll?accountType=${accountType}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return {
            status: true,
            data: response.data,
        };
    } catch (error) {
        return { status: false, message: "Network Error" };
    }
};

export const fn_getAdminLoginHistoryApi = async (adminId) => {
    try {
        const token = Cookies.get('token');
        const response = await axios.get(`${BACKEND_URL}/loginHistory/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            status: true,
            message: "Data Fetched Successfully",
            data: response?.data?.data
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_updateApiKeys = async (apiKey, secretKey) => {

    try {
        const token = Cookies.get("token");
        const response = await axios.put(`${BACKEND_URL}/admin/update`,
            { apiKey, secretKey },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            message: "Admin Verified Successfully",
            data: response
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_getApiKeys = async () => {
    try {
        const token = Cookies.get("token");
        const response = await axios.post(`${BACKEND_URL}/admin/get`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            data: response.data,
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_createMerchantApi = async (formdata) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.post(`${BACKEND_URL}/merchant/create`,
            formdata,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            status: true,
            data: response.data,
        };
    } catch (error) {
        if (error?.response?.status !== 500) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_getMerchantApi = async () => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BACKEND_URL}/merchant/getAll`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            data: response.data,
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_MerchantUpdate = async (id, data) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.put(`${BACKEND_URL}/merchant/update/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            data: response.data,
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_deleteTransactionApi = async (id) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.delete(`${BACKEND_URL}/ledger/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        return {
            status: true,
            message: "Transaction Deleted",
        };
    } catch (error) {
        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_getAllTransactionApi = async (status, pageNumber) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BACKEND_URL}/ledger/getAllAdmin?page=${pageNumber}&status=${status || ""}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        console.log(response);
        return {
            status: true,
            message: "Merchants show successfully",
            data: response.data,
        };
    } catch (error) {
        console.error(error);

        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_updateTransactionStatusApi = async (transactionId, data) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.put(
            `${BACKEND_URL}/ledger/update/${transactionId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        );

        return {
            status: response?.data?.status === "ok",
            message: response?.data?.message || "Transaction updated successfully",
            data: response?.data,
        };
    } catch (error) {
        console.error(`Error updating transaction status:`, error?.response || error);
        return {
            status: false,
            message: error?.response?.data?.message || "An error occurred",
        };
    }
};

export default BACKEND_URL;