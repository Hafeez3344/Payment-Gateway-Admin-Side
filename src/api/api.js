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
        const type = response?.data?.type;

        return {
            status: true,
            message: "Admin Logged in successfully",
            token: token,
            id: id,
            type
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
        const response = await axios.put(
            `${BACKEND_URL}/bank/update/${id}`,
            data, // Send the data object directly instead of modifying it
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

export const fn_getBankByAccountTypeApi = async (data) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BACKEND_URL}/withdrawBank/getAll?merchantId=${data}`,
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

export const fn_getAllBanksData = async (accountType, page = 1) => {
    try {
        const token = Cookies.get("token");
        const url = `${BACKEND_URL}/bank/getAll?${
            accountType === "disabledBanks"
                ? "disable=true"
                : `accountType=${accountType}&disable=false`
        }&page=${page}`;

        const response = await axios.get(url, {
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

export const fn_getAllTransactionApi = async (status, pageNumber, searchTrnId, searchQuery, merchantId, dateRange, bankId) => {
    try {
        const token = Cookies.get("token");
        const type = Cookies.get("type");
        const adminId = Cookies.get("adminId");
        let url = "";
        if (type === "staff") {
            url = `${BACKEND_URL}/ledger/getAllAdmin?adminStaffId=${adminId}&limit=100&page=${pageNumber}${status ? `&status=${status}` : ''}${searchTrnId ? `&trnNo=${searchTrnId}` : ''}${searchQuery ? `&utr=${searchQuery}` : ''}${merchantId ? `&merchantId=${merchantId}` : ''}${bankId ? `&bankId=${bankId}` : ''}${(dateRange && dateRange?.[0]) ? `&startDate=${new Date(dateRange?.[0]?.$d)}&endDate=${new Date(dateRange?.[1]?.$d)}` : ""}`;
        } else {
            url = `${BACKEND_URL}/ledger/getAllAdmin?limit=100&page=${pageNumber}${status ? `&status=${status}` : ''}${searchTrnId ? `&trnNo=${searchTrnId}` : ''}${searchQuery ? `&utr=${searchQuery}` : ''}${merchantId ? `&merchantId=${merchantId}` : ''}${bankId ? `&bankId=${bankId}` : ''}${(dateRange && dateRange?.[0]) ? `&startDate=${new Date(dateRange?.[0]?.$d)}&endDate=${new Date(dateRange?.[1]?.$d)}` : ""}`;
        }
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("API Response:", response.data);
        return {
            status: true,
            message: "Transactions fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error("API Error:", error);
        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_getAdminsTransactionApi = async (status, searchTrnId, searchQuery, merchantId, dateRange, bankId) => {
    try {
        const token = Cookies.get("token");
        const type = Cookies.get("type");
        let url = "";
        if (type === "staff") {
            url = `${BACKEND_URL}/ledger/getAllAdminWithoutPag?adminStaffId=${adminId}&${status ? `&status=${status}` : ''}${searchTrnId ? `&trnNo=${searchTrnId}` : ''}${searchQuery ? `&utr=${searchQuery}` : ''}${merchantId ? `&merchantId=${merchantId}` : ''}${bankId ? `&bankId=${bankId}` : ''}${(dateRange && dateRange?.[0]) ? `&startDate=${new Date(dateRange?.[0]?.$d)}&endDate=${new Date(dateRange?.[1]?.$d)}` : ""}`;
        } else {
            url = `${BACKEND_URL}/ledger/getAllAdminWithoutPag?${status ? `&status=${status}` : ''}${searchTrnId ? `&trnNo=${searchTrnId}` : ''}${searchQuery ? `&utr=${searchQuery}` : ''}${merchantId ? `&merchantId=${merchantId}` : ''}${bankId ? `&bankId=${bankId}` : ''}${(dateRange && dateRange?.[0]) ? `&startDate=${new Date(dateRange?.[0]?.$d)}&endDate=${new Date(dateRange?.[1]?.$d)}` : ""}`;
        }
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("API Response:", response.data);
        return {
            status: true,
            message: "Transactions fetched successfully",
            data: response.data,
        };
    } catch (error) {
        console.error("API Error:", error);
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

export const fn_DeleteBank = async (id) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.delete(`${BACKEND_URL}/bank/delete/${id}`, {
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
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_BankActivateApi = async (id, accountType) => {
    try {
        const token = Cookies.get("token");
        const type = accountType === "upi" ? "upi" : "bank";

        const response = await axios.post(  // Changed from put to post
            `${BACKEND_URL}/bank/active?id=${id}&accountType=${type}`,
            {},  // Empty body
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            message: response.data?.message || `${type.toUpperCase()} status updated successfully`,
            data: response.data
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

//------------------------------------Create Ticket Api-----------------------------------------------
export const fn_createTicketApi = async (ticketData) => {
    try {
        const token = Cookies.get("token");
        console.log("Creating ticket with data:", ticketData);

        const response = await axios.post(
            `${BACKEND_URL}/ticket/create`,
            {
                ...ticketData,
                title: ticketData.subject,
                type: "admin"
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Ticket creation response:", response.data);
        return {
            status: true,
            message: "Ticket created successfully",
            data: response.data
        };
    } catch (error) {
        console.error("Ticket creation API error:", error.response || error);
        return {
            status: false,
            message: error?.response?.data?.message || "Network Error",
            error: error?.response?.data || error
        };
    }
};

//------------------------------------Get All Tickets Api-----------------------------------------------
export const fn_getAllTicketsApi = async () => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(
            `${BACKEND_URL}/ticket/getAllAdmin`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Tickets response:", response.data);
        return {
            status: true,
            data: response.data?.data || []
        };
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return {
            status: false,
            message: error?.response?.data?.message || "Failed to fetch tickets"
        };
    }
};

export const fn_updateTicketStatusApi = async (ticketId, data) => {
    try {
        const token = Cookies.get("token");
        console.log("Updating ticket:", { ticketId, data });

        const response = await axios.put(
            `${BACKEND_URL}/ticket/update/${ticketId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        );

        console.log("Update ticket response:", response);

        if (response?.data) {
            return {
                status: true,
                message: "Ticket updated successfully",
                data: response.data
            };
        }
        throw new Error("Invalid response from server");
    } catch (error) {
        console.error("Update ticket error:", error?.response?.data || error);
        return {
            status: false,
            message: error?.response?.data?.message || "Failed to update ticket"
        };
    }
};

export const fn_getCardDataByStatus = async (status, filter) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BACKEND_URL}/ledger/cardAdminData?status=${status}&filter=${filter}`, {
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
        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_updateMerchantCommissionApi = async (merchantId, commission) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.put(
            `${BACKEND_URL}/merchant/update/${merchantId}`,
            { commision: commission },
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

export const fn_createCurrencyExchange = async (data) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.post(
            `${BACKEND_URL}/exchange/create`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: response.data.status === "ok",
            message: response.data.message,
            data: response.data.data
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

export const fn_editCurrencyExchange = async (id, data) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.put(
            `${BACKEND_URL}/exchange/update/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: response.data.status === "ok",
            message: response.data.message,
            data: response.data.data
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

export const fn_deleteCurrencyExchange = async (currencyId) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.delete(
            `${BACKEND_URL}/exchange/delete/${currencyId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: response.data.status === "ok",
            message: response.data.message || "Currency deleted successfully"
        };
    } catch (error) {
        return {
            status: false,
            message: error?.response?.data?.message || "Failed to delete currency"
        };
    }
};

export const fn_getAllCurrencyExchange = async () => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BACKEND_URL}/exchange/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return {
            status: true,
            data: response.data?.data ?? [],
        };
    } catch (error) {
        console.error("Error fetching currencies:", error);
        return {
            status: false,
            message: error?.response?.data?.message || "An error occurred",
            data: [],
        };
    }
};

export const fn_getAllWithdrawTransactions = async (pageNumber) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BACKEND_URL}/withdraw/getAll?type=admin&page=${pageNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return {
            status: true,
            data: { data: response.data?.data || [], totalPage: response.data?.totalPages || 0 }
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

export const fn_getAllBankLogs = async () => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BACKEND_URL}/banklog/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return {
            status: true,
            data: response.data?.data || []
        };
    } catch (error) {
        console.error("Error fetching bank logs:", error);
        return {
            status: false,
            message: error?.response?.data?.message || "Failed to fetch bank logs",
            data: []
        };
    }
};

export const fn_createBankName = async (bankName) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.post(
            `${BACKEND_URL}/bankNames/create`,
            { bankName },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            message: "Bank added successfully",
            data: response.data
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_getAllBankNames = async () => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(
            `${BACKEND_URL}/bankNames/getAll`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            data: response.data?.data || []
        };
    } catch (error) {
        return { 
            status: false, 
            message: error?.response?.data?.message || "Failed to fetch bank names" 
        };
    }
};

export default BACKEND_URL;