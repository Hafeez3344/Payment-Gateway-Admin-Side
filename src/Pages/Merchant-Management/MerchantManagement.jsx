import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Rectangle from "../../assets/Rectangle.jpg";
import CanaraBank from "../../assets/CanaraBank.svg";
import { FiEdit } from "react-icons/fi";
import { Switch, Button, Modal, Input } from "antd";

const MerchantManagement = ({ showSidebar }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    });
  };
  const { TextArea } = Input;

  const navigate = useNavigate();
  const containerHeight = window.innerHeight - 120;

  const [merchants, setMerchants] = useState([
    {
      name: "Shubh Exchange",
      accounts: 5,
      website: "www.sizuh.exchange",
      limit: "₹150000",
      status: "Active",
      isToggled: false,
    },
    {
      name: "BetXFair",
      accounts: 7,
      website: "www.bet2fair.com",
      limit: "₹300000",
      status: "Active",
      isToggled: false,
    },
    {
      name: "Book Fair",
      accounts: 4,
      website: "www.bookfair.com",
      limit: "₹120000",
      status: "Inactive",
      isToggled: false,
    },
    {
      name: "All Exchange",
      accounts: 9,
      website: "www.allexchange.com",
      limit: "₹780000",
      status: "Active",
      isToggled: false,
    },
    {
      name: "New Bet Exchange",
      accounts: 9,
      website: "www.newbetexchange.com",
      limit: "₹350000",
      status: "Disabled",
      isToggled: false,
    },
    {
      name: "All Exchange",
      accounts: 9,
      website: "www.allexchange.com",
      limit: "₹780000",
      status: "Active",
      isToggled: false,
    },
  ]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleToggle = (index) => {
    setMerchants((prevMerchants) =>
      prevMerchants.map((merchant, i) =>
        i === index ? { ...merchant, isToggled: !merchant.isToggled } : merchant
      )
    );
  };

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        {/* header */}
        <div className="flex justify-between items-center">
          <h1 className="text-[25px] font-[500]">Merchant Management</h1>
          <p
            onClick={() => navigate("/Home")}
            className="text-[#7987A1] text-[15px] font-[400] cursor-pointer"
          >
            Dashboard - Data Table
          </p>
        </div>
        {/* content */}
        <div className="flex flex-col gap-7 md:flex-row bg-gray-100 pt-4 lg:pt-7">
          {/* Left side card */}
          <div className="w-full md:w-2/6 bg-white rounded-lg lg:min-h-[550px] shadow-md border">
            <div className="flex flex-col">
              <img
                src={Rectangle}
                alt="Logo"
                className="h-[130px] object-cover w-full rounded-t-lg"
              />
            </div>
            <h2 className="text-[17px] font-[600] mt-4 text-center">BetPay</h2>
            <p className="text-gray-500 text-[13px] text-center">@betpayllc</p>
            <div className="m-3">
              <h3 className="text-[18px] font-[600] border-b pb-2">
                Personal Info
              </h3>
              <div className="space-y-3 pt-3">
                <div className="grid grid-cols-2">
                  <span className="text-[14px] font-[600]">Full Name:</span>
                  <span className="text-[13px] font-[600] text-left text-[#505050]">
                    Bet Pay Inc
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-[14px] font-[600]">Email:</span>
                  <span className="text-[13px] font-[600] text-left text-[#505050]">
                    willjontex@gmail.com
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-[14px] font-[600]">Phone Number:</span>
                  <span className="text-[13px] font-[600] text-left text-[#505050]">
                    +91 9036 2361 236
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-[14px] font-[600]">Website:</span>
                  <a
                    href="https://www.betpay.com"
                    className="text-[13px] font-[600] text-left text-[#505050]"
                  >
                    www.betpay.com
                  </a>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-[14px] font-[600]">Bio:</span>
                  <span className="text-[13px] font-[600] text-left text-[#505050]">
                    BetPay is Largest Payment Provider in Betting Industry
                    across the World
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side Card */}
          <div className="w-full md:w-3/4 lg:min-h-[550px] bg-white rounded-lg shadow-md border">
            {/* Reduced padding */}
            <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b space-y-4 md:space-y-0">
              {/* Merchant Accounts Button */}
              <div className="w-full md:w-auto">
                <button
                  className="text-[14px] font-[600] px-4 py-2 w-full md:w-auto"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(8, 100, 232, 0.1), rgba(115, 115, 115, 0))",
                  }}
                >
                  Merchant Accounts
                </button>
              </div>

              {/* Search Input and Add Merchant Button */}
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <Button type="primary" onClick={showLoading}>
                  Add Merchant
                </Button>
                <Modal
                  centered
                  title={
                    <p className="text-[16px] font-[700]">
                      Add New Merchant Account
                    </p>
                  }
                  footer={
                    <div className="flex gap-4 mt-6">
                      <Button className="flex start px-10 text-[12px]" type="primary">
                        Save
                      </Button>
                      <Button
                        className="flex start px-10 bg-white text-[#FF3D5C] border border-[#FF7A8F] text-[12px]"
                        type=""
                      >
                        Cancel
                      </Button>
                    </div>
                  }
                  loading={loading}
                  open={open}
                  onCancel={() => setOpen(false)}
                >
                  <div className="flex gap-4 ">
                    <div className="flex-1 my-2">
                      <p className="text-[12px] font-[500] pb-1">
                        Merchant Name <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        className="w-full text-[12px]"
                        placeholder="Enter Merchant Name"
                      />
                    </div>
                    <div className="flex-1 my-2">
                      <p className="text-[12px] font-[500] pb-1">
                        Phone Number <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        className="w-full  text-[12px]"
                        placeholder="Enter Phone Number"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 my-2">
                      <p className="text-[12px] font-[500] pb-1">Email <span className="text-[#D50000]">*</span></p>
                      <Input className="w-full text-[12px]" placeholder="Enter Email" />
                    </div>
                    <div className="flex-1 my-2">
                      <p className="text-[12px] font-[500] pb-1">
                        Account Limit <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        className="w-full text-[12px]"
                        placeholder="Enter Account Limit"
                      />
                    </div>
                  </div>
                  <p className="text-[12px] font-[500] pb-1 mt-2">API Key <span className="text-[#D50000]">*</span></p>
                  <Input className="text-[12px]" placeholder="Enter Merchant API Key" />
                </Modal>
              </div>
            </div>

            <div className="overflow-x-auto">
              {" "}
              {/* Make sure the table can scroll */}
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#ECF0FA]">
                  <tr>
                    <th className="p-3 text-[13px] font-[600]">
                      Merchant Name
                    </th>
                    <th className="p-5 text-[13px] font-[600]">Accounts</th>
                    <th className="p-5 text-[13px] font-[600]">Website</th>
                    <th className="p-5 text-[13px] font-[600]">Limit</th>
                    <th className="p-5 text-[13px] font-[600]">Status</th>
                    <th className="p-5 text-[13px] font-[600]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {merchants.map((merchant, index) => (
                    <tr
                      key={index}
                      className={`border-t border-b ${
                        index % 2 === 0 ? "bg-white" : ""
                      }`}
                    >
                      {/* Bank Logo and Name */}
                      <td className="p-3 text-[13px] font-[600]">
                        <div className="flex items-center space-x-2">
                          <img
                            src={CanaraBank} // Placeholder image
                            alt={`${merchant.name} logo`}
                            className="w-6 h-6 object-contain" // Adjust size as needed
                          />
                          <span>{merchant.name}</span>
                        </div>
                      </td>

                      {/* Accounts */}
                      <td className="p-3 text-[13px] pl-8">
                        {merchant.accounts}
                      </td>

                      {/* Website */}
                      <td className="p-3 text-[13px]">
                        <a
                          href={`https://${merchant.website}`}
                          className="text-blue-500 hover:underline"
                        >
                          {merchant.website}
                        </a>
                      </td>

                      {/* Limit */}
                      <td className="p-3 text-[13px] font-[400]">
                        {merchant.limit}
                      </td>

                      {/* Status */}
                      <td className=" text-center">
                        <button
                          className={`px-3 py-[5px] rounded-[20px] w-20 flex items-center justify-center text-[13px] font-[600] ${
                            merchant.status === "Active"
                              ? "bg-[#10CB0026] text-[#0DA000]"
                              : "bg-[#FF173D33] text-[#D50000]"
                          }`}
                        >
                          {merchant.status === "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center">
                          {/* Toggle Button */}
                          <Switch size="small" defaultChecked />
                          <button
                            className="bg-green-100 text-green-600 rounded-full px-2 py-2 mx-2"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantManagement;
