import { Input } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fn_getAdminLoginHistoryApi,
  fn_updateApiKeys,
  fn_getApiKeys,
} from "../../api/api";

const SystemConfigurationIntegration = ({ authorization, showSidebar }) => {

  const navigate = useNavigate();
  const containerHeight = window.innerHeight - 120;
  const [loginData, setLoginData] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
    } else {
      fetchAdminLoginHistory();
      fetchApiKeys();
    }
  }, [authorization]);

  const fetchAdminLoginHistory = async () => {
    const adminId = Cookies.get("adminId");
    const response = await fn_getAdminLoginHistoryApi(adminId);
    if (response?.status) {
      setLoginData(response?.data || []);
    } else {
      console.error("Error fetching login history:", response.message);
    }
  };

  const fetchApiKeys = async () => {
    const response = await fn_getApiKeys();
    if (response?.status) {
      setApiKey(response?.data?.data?.apiKey || "");
      setSecretKey(response?.data?.data?.secretKey || "");
    } else {
      console.error("Error fetching API keys:", response.message);
    }
  };

  const handleApiKeySubmission = async () => {
    if (!apiKey || !secretKey) {
      setStatusMessage("Both API Key and Secret Key are required.");
      return;
    }
    const response = await fn_updateApiKeys(apiKey, secretKey);
    setStatusMessage(response.message);
  };

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
        }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[20px] md:text-[25px] font-[500]">
            System Configuration Integration
          </h1>
          <p
            onClick={() => navigate("/SystemConfigurationIntegration")}
            className="text-[#7987A1] text-[13px] md:text-[15px] font-[400] cursor-pointer"
          >
            Dashboard - Data Table
          </p>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-lg p-4">
          <div className="pb-3">
            <p className="text-black text-[14px] font-[600]">API Keys</p>
            <span className="text-[16px] font-[600]">Your API Keys</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-300 p-4">
            <div className="w-full">
              <div className="flex space-x-4 mb-3">
                <div className="flex-1">
                  <Input.Password
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API Key"
                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-300 hover:border-blue-300"
                  />
                </div>
                <div className="flex-1">
                  <Input.Password
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter Secret Key"
                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-300 hover:border-blue-300"
                  />
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={handleApiKeySubmission}
                  className="bg-[#0864E8] text-white px-10 rounded-md hover:bg-[#065BCC]"
                >
                  <p className="text-[14px] py-2 px-3">Save</p>
                </button>
                {statusMessage && (
                  <p
                    className={`mt-2 ml-2 text-[14px] ${statusMessage.includes("Admin Verified Successfully")
                      ? "text-green-500"
                      : "text-red-500"
                      }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Login History Section */}
        <div className="bg-white rounded-lg p-4 mt-6">
          <div className="pb-3">
            <p className="text-black text-[14px] font-[600]">Login History</p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4">Login Date & Time</th>
                  {/* <th className="p-4">Logout Date & Time</th> */}
                  <th className="p-4">IP Address</th>
                  {/* <th className="p-4">ISP</th> */}
                  <th className="p-4">City</th>
                </tr>
              </thead>
              <tbody>
                {loginData.length > 0 ? (
                  loginData.map((entry, index) => (
                    <tr key={index} className="text-gray-800 text-sm border-b">
                      <td className="p-4">{entry.loginDate || "-"}</td>
                      {/* <td className="p-4">{entry.logoutDate || "-"}</td> */}
                      <td className="p-4">
                        {entry.ip?.split("::ffff:")[1] || "-"}
                      </td>
                      {/* <td className="p-4">{entry.isp || "-"}</td> */}
                      <td className="p-4">{entry.city || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No login history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurationIntegration;
