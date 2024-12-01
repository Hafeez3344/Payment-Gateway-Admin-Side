import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fn_getAdminLoginHistoryApi } from "../../api/api";

const SystemConfigurationIntegration = ({ authorization, showSidebar }) => {
  const navigate = useNavigate();
  const containerHeight = window.innerHeight - 120;
  const [loginData, setLoginData] = useState([]);

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
    }
    fn_getAdminHistory();
  }, []);

  const fn_getAdminHistory = async () => {
    const adminId = Cookies.get("adminId");
    const response = await fn_getAdminLoginHistoryApi(adminId);
    console.log("response ", response);
    if (response?.status) {
      setLoginData(response?.data);
    }
  };

  const apiKeys = [
    {
      version: "V3",
      apiKey: "********X04rJT",
      name: "prestashop 1.7",
      createdOn: "01 Jan 2023",
    },
    {
      version: "V3",
      apiKey: "********QnbN5",
      name: "WordPress",
      createdOn: "15 Feb 2023",
    },
  ];

  const loginHistory = [
    {
      loginDate: "01 Jan 2024, 09:00 AM",
      logoutDate: "01 Jan 2024, 05:00 PM",
      ipAddress: "192.168.1.101",
      isp: "Triple Play Project",
      city: "Mumbai, Maharashtra, India",
    },
    {
      loginDate: "02 Jan 2024, 10:00 AM",
      logoutDate: "02 Jan 2024, 06:00 PM",
      ipAddress: "192.168.1.102",
      isp: "Triple Play Project",
      city: "Mumbai, Maharashtra, India",
    },
    {
      loginDate: "03 Jan 2024, 08:30 AM",
      logoutDate: "03 Jan 2024, 04:30 PM",
      ipAddress: "192.168.1.103",
      isp: "Triple Play Project",
      city: "Mumbai, Maharashtra, India",
    },
    {
      loginDate: "03 Jan 2024, 08:30 AM",
      logoutDate: "03 Jan 2024, 04:30 PM",
      ipAddress: "192.168.1.103",
      isp: "Triple Play Project",
      city: "Mumbai, Maharashtra, India",
    },
  ];

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
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

        {/* API keys section */}
        <div className="bg-white rounded-lg p-4">
          <div className="pb-3">
            <p className="text-black text-[11px] font-[600]">API Keys</p>
            <span className="text-[13px] font-[600]">Your API Keys</span>
          </div>
          {/* <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-full">
              <thead>
                <tr className="border-b text-left text-[12px] text-gray-700">
                  <th className="p-4">Version</th>
                  <th className="p-4">API Key</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Created On</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key, index) => (
                  <tr key={index} className="text-gray-800 text-sm border-b">
                    <td className="p-4 flex items-center gap-2 text-[11px] font-[600] text-[#000000B2]">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4"
                      />
                      {key.version}
                    </td>
                    <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                      {key.apiKey}
                    </td>
                    <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                      {key.name}
                    </td>
                    <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                      {key.createdOn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="w-full max-w-lg">
              <div className="flex mb-3">
                <div className="w-full mr-4">
                  <label
                    htmlFor="apiKey"
                    className="block text-sm font-medium mb-1"
                  >
                    API Key
                  </label>
                  <input
                    type="text"
                    id="apiKey"
                    placeholder="Enter API Key"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="secretKey"
                    className="block text-sm font-medium mb-1"
                  >
                    Secret Key
                  </label>
                  <input
                    type="text"
                    id="secretKey"
                    placeholder="Enter Secret Key"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-md mt-3">
                Submit
              </button>
            </div>
          </div> */}

          <div className="overflow-x-auto rounded-lg border border-gray-300 p-4">
            <div className="w-full max-w-lg">
              <div className="flex space-x-4 mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    id="apiKey"
                    placeholder="Enter API Key"
                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-300 hover:border-blue-300 min-h-[40px]"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    id="secretKey"
                    placeholder="Enter Secret Key"
                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-300 hover:border-blue-300 min-h-[40px]"
                  />
                </div>
              </div>
              <button className="bg-blue-500 text-white py-2 px-6  rounded-md mt-3">
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Login history section */}
        <div className="bg-white rounded-lg p-4 mt-6">
          <div className="pb-3">
            <p className="text-black text-[14px] font-[600]">Login History</p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4">Login Date & Time</th>
                  <th className="p-4">Logout Date & Time</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">ISP</th>
                  <th className="p-4">City</th>
                </tr>
              </thead>
              <tbody>
                {loginData.length > 0 &&
                  loginData.map((entry, index) => (
                    <tr key={index} className="text-gray-800 text-sm border-b">
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.loginDate || "1"}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.logoutDate || "1"}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.ipAddress || "1"}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.isp || "1"}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.city || "1"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurationIntegration;
