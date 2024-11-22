import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Rectangle from "../../assets/Rectangle.jpg";
import CanaraBank from "../../assets/CanaraBank.svg";
import { FiEdit } from "react-icons/fi";
import { Switch, Button, Modal, Input } from "antd";
import logo from "../../assets/logo.png";

const MerchantManagement = ({ showSidebar }) => {
  const [open, setOpen] = React.useState(false);
  const { TextArea } = Input;

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
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Merchant Management</h1>
          <p
            className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]"
          >
            Dashboard - Data Table
          </p>
        </div>
        {/* content */}
        <div className="flex flex-col gap-7 md:flex-row bg-gray-100 ">
          {/* Left side card */}
          <div className="w-full md:w-2/6 bg-white rounded-lg lg:min-h-[550px] shadow-md border">
            <div className="flex flex-col z-[-1] items-center">
              <img
                src={Rectangle}
                alt="Logo"
                className="h-[130px] object-cover w-full rounded-t-lg"
              />
              <div
                className="w-[150px] h-[150px] rounded-full flex justify-center items-center bg-white mt-[-75px] z-[9]"
                style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.15)" }}
              >
                <img src={logo} alt="logo" className="w-[75px]" />
              </div>
            </div>
            <h2 className="text-[19px] font-[700] mt-4 text-center">BetPay</h2>
            <p className="text-gray-500 text-[13px] text-center">@betpayllc</p>
            <div className="m-3 mt-6">
              <h3 className="text-[17px] font-[700] border-b pb-2">
                Personal Info
              </h3>
              <div className="space-y-3 pt-3">
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Full Name:
                  </span>
                  <span className="text-[12px] font-[600] text-left text-[#505050] w-full">
                    Bet Pay Inc
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Email:
                  </span>
                  <span className="text-[12px] font-[600] text-left text-[#505050] w-full">
                    willjontex@gmail.com
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Phone Number:
                  </span>
                  <span className="text-[12px] font-[600] text-left text-[#505050] w-full">
                    +91 9036 2361 236
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Website:
                  </span>
                  <a
                    href="https://www.betpay.com"
                    className="text-[12px] font-[600] text-left text-[#505050] w-full"
                  >
                    www.betpay.com
                  </a>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Bio:
                  </span>
                  <span className="text-[12px] font-[600] text-[#505050] w-full">
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
                <button className="text-[10px] text-[#00000080] rounded border border-[#0000001A] px-4 py-2 w-full md:w-auto">
                  Search Merchant...
                </button>
                <Button type="primary" onClick={() => setOpen(true)}>
                  Add Merchant
                </Button>
                <Modal
                  centered
                  width={600}
                  style={{ fontFamily: "sans-serif" }}
                  title={
                    <p className="text-[16px] font-[700]">
                      Add New Merchant Account
                    </p>
                  }
                  footer={
                    <div className="flex gap-4 mt-6">
                      <Button
                        className="flex start px-10 text-[12px]"
                        type="primary"
                      >
                        Save
                      </Button>
                      <Button
                        className="flex start px-10 bg-white text-[#FF3D5C] border border-[#FF7A8F] text-[12px]"
                        type=""
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  }
                  open={open}
                  onCancel={() => setOpen(false)}
                  onClose={() => setOpen(false)}
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
                      <p className="text-[12px] font-[500] pb-1">
                        Email <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        className="w-full text-[12px]"
                        placeholder="Enter Email"
                      />
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
                  <p className="text-[12px] font-[500] pb-1 mt-2">
                    API Key <span className="text-[#D50000]">*</span>
                  </p>
                  <Input
                    className="text-[12px]"
                    placeholder="Enter Merchant API Key"
                  />
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
                      <td className="p-3 text-[13px] font-[600]">
                        <div className="flex items-center space-x-2 flex-wrap md:flex-nowrap">
                          <img
                            src={CanaraBank} // Placeholder image
                            alt={`${merchant.name} logo`}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="whitespace-nowrap">
                            {merchant.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-[13px] pl-8">
                        {merchant.accounts}
                      </td>
                      <td className="p-3 text-[13px]">
                        <a
                          href={`https://${merchant.website}`}
                          className="text-blue-500 hover:underline"
                        >
                          {merchant.website}
                        </a>
                      </td>
                      <td className="p-3 text-[13px] font-[400]">
                        {merchant.limit}
                      </td>
                      <td className="text-center">
                        <button
                          className={`px-3 py-[5px] rounded-[20px] w-20 flex items-center justify-center text-[11px] font-[500] ${
                            merchant.status === "Active"
                              ? "bg-[#10CB0026] text-[#0DA000]"
                              : merchant.status === "Inactive"
                              ? "bg-[#FF173D33] text-[#D50000]"
                              : merchant.status === "Disabled"
                              ? "bg-[#BDBDBD] "
                              : ""
                          }`}
                        >
                          {merchant.status === "Active"
                            ? "Active"
                            : merchant.status === "Inactive"
                            ? "Inactive"
                            : merchant.status === "Disabled"
                            ? "Disabled"
                            : ""}
                        </button>
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center">
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
