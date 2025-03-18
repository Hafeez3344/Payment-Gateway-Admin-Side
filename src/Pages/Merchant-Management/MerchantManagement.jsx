import { FiEdit } from "react-icons/fi";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Rectangle from "../../assets/Rectangle.jpg";
import { Switch, Button, Modal, Input, notification } from "antd";
import BACKEND_URL, {
  fn_createMerchantApi,
  fn_getMerchantApi,
  fn_MerchantUpdate,
} from "../../api/api";
import Cookies from "js-cookie";

const MerchantManagement = ({ authorization, showSidebar, setAuthorization }) => {
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [tax, setTax] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [website, setWebsite] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = React.useState(false);
  const [commision, setCommision] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const containerHeight = window.innerHeight - 120;
  const [accountLimit, setAccountLimit] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [merchantsData, setMerchantsData] = useState([]);
  const [merchantWebsite, setMerchantWebsite] = useState("");
  const [payoutCommision, setPayoutCommision] = useState("");
  const [websiteUseForPayment, setWebsiteUseForPayment] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  // const firstMerchant = merchantsData.length > 0 ? merchantsData[0] : null;
  const firstMerchant =
    selectedMerchant || (merchantsData.length > 0 ? merchantsData[0] : null);

  const filteredMerchants = merchantsData.filter((merchant) =>
    merchant.merchantName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const fn_getMerchant = async () => {
    const response = await fn_getMerchantApi();
    if (response?.status) {
      setMerchantsData(response?.data?.data);
    } else {
      setMerchantsData([]);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
    }
    fn_getMerchant();
  }, []);

  const handleToggle = (index) => {
    setMerchants((prevMerchants) =>
      prevMerchants.map((merchant, i) =>
        i === index ? { ...merchant, isToggled: !merchant.isToggled } : merchant
      )
    );
  };

  const handleSave = async () => {
    const newErrors = {};

    if (!String(merchantName).trim())
      newErrors.merchantName = "Merchant Name is required.";
    if (!String(phone).trim()) newErrors.phone = "Phone Number is required.";
    if (!String(email).trim()) newErrors.email = "Email is required.";
    if (!String(password).trim()) newErrors.password = "Password is required.";
    if (!String(accountLimit).trim())
      newErrors.accountLimit = "Account Limit is required.";
    if (!String(websiteUseForPayment).trim())
      newErrors.websiteUseForPayment = "Website Use for Payment is required.";
    if (!String(merchantWebsite).trim())
      newErrors.merchantWebsite = "Merchant Website is required.";
    if (!String(tax).trim()) newErrors.tax = "Tax is required.";
    if (!String(payoutCommision).trim())
      newErrors.payoutCommision = "Payout Commission is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const formData = new FormData();
    formData.append("image", image);
    formData.append("merchantName", merchantName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("website", websiteUseForPayment);
    formData.append("accountLimit", accountLimit);
    formData.append("merchantWebsite", merchantWebsite);
    formData.append("commision", parseFloat(tax));
    formData.append("payoutCommision", parseFloat(payoutCommision));
    try {
      let response;
      if (selectedMerchant) {
        // Update existing merchant
        response = await fn_MerchantUpdate(selectedMerchant._id, formData);
      } else {
        // Create new merchant
        response = await fn_createMerchantApi(formData);
      }

      if (response?.status) {
        notification.success({
          message: "Success",
          description: selectedMerchant
            ? "Merchant Updated Successfully!"
            : "Merchant Created Successfully!",
          placement: "topRight",
        });
        setOpen(false);
        setSelectedMerchant(null);
        setMerchantName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setAccountLimit("");
        setWebsiteUseForPayment("");
        setMerchantWebsite("");
        setTax("");
        setPayoutCommision("");
        setImage(null);
        fn_getMerchant();
      } else {
        notification.error({
          message: "Error",
          description: response?.message || "Failed to save merchant.",
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An unexpected error occurred. Please try again later.",
        placement: "topRight",
      });
    }
  };

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
        }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        {/* header */}
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Merchant Management</h1>
          <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
            Dashboard - Data Table
          </p>
        </div>
        <div className="flex flex-col gap-7 md:flex-row bg-gray-100 ">
          {/* Left side card */}
          {/* <div className="w-full md:w-2/6 bg-white rounded-lg lg:min-h-[550px] shadow-md border">
            <div className="flex flex-col z-[-1] items-center">
              <img
                src={Rectangle}
                alt="Logo"
                className="h-[130px] object-cover w-full rounded-t-lg"
              />
              <div
                className="w-[150px] h-[150px] rounded-full flex justify-center items-center bg-white mt-[-75px] z-[9]"
                style={{ boxShadow: "0px  0px 10px 0px rgba(0, 0, 0, 0.15)" }}
              >
                {firstMerchant && firstMerchant.image && (
                  <img
                    src={`${BACKEND_URL}/${firstMerchant.image}`}
                    alt="Merchant Logo"
                    className="w-[75px] rounded-full"
                  />
                )}
              </div>
            </div>
            <h2 className="text-[19px] font-[700] mt-4 text-center">
              {firstMerchant ? firstMerchant.merchantName : "No Merchant"}
            </h2>
            <div className="m-3 mt-6">
              <h3 className="text-[17px] font-[700] border-b pb-2">
                Personal Info
              </h3>
              <div className="space-y-3 pt-3">
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Email:
                  </span>
                  <span className="text-[12px] font-[600] text-left text-[#505050] w-full">
                    {firstMerchant ? firstMerchant.email : "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Phone Number:
                  </span>
                  <span className="text-[12px] font-[600] text-left text-[#505050] w-full">
                    {firstMerchant ? firstMerchant.phone : "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Website:
                  </span>
                  <a
                    href={
                      firstMerchant
                        ? `https://${firstMerchant.merchantWebsite}`
                        : "#"
                    }
                    className="text-[12px] font-[600] text-left text-[#505050] w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {firstMerchant ? firstMerchant.merchantWebsite : "N/A"}
                  </a>
                </div>
              </div>
            </div>
          </div> */}
          {/* Right side Card */}
          <div className="w-full lg:min-h-[550px] bg-white rounded-lg shadow-md border">
            <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b space-y-4 md:space-y-0">
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

              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <Input
                  placeholder="Search Merchant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "140px" }}
                />
                <Button type="primary" onClick={() => setOpen(true)}>
                  Add Merchant
                </Button>
                <Modal
                  centered
                  width={600}
                  title={
                    <p className="text-[16px] font-[700]">
                      {selectedMerchant
                        ? "Edit Merchant Account"
                        : "Add New Merchant Account"}
                    </p>
                  }
                  footer={
                    <div className="flex gap-4 mt-6">
                      <Button type="primary" onClick={handleSave}>
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setOpen(false);
                          setSelectedMerchant(null);
                          setMerchantName("");
                          setPhone("");
                          setEmail("");
                          setPassword("");
                          setAccountLimit("");
                          setWebsiteUseForPayment("");
                          setMerchantWebsite("");
                          setTax("");
                          setPayoutCommision("");
                          setImage(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  }
                  open={open}
                  onCancel={() => {
                    setOpen(false);
                    setSelectedMerchant(null); // Reset selected merchant
                    // Reset form fields
                    setMerchantName("");
                    setPhone("");
                    setEmail("");
                    setPassword("");
                    setAccountLimit("");
                    setWebsiteUseForPayment("");
                    setMerchantWebsite("");
                    setTax("");
                    setPayoutCommision("");
                    setImage(null);
                  }}
                >
                  <div className="flex gap-4">
                    <div className="flex-1 my-2">
                      <p>
                        Merchant Name <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        placeholder="Enter Merchant Name"
                        value={merchantName}
                        onChange={(e) => setMerchantName(e.target.value)}
                      />
                      {errors.merchantName && (
                        <p className="text-red-500">{errors.merchantName}</p>
                      )}
                    </div>
                    <div className="flex-1 my-2">
                      <p>
                        Phone Number <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        placeholder="Enter Phone Number"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setPhone(value);
                        }}
                      />
                      {errors.phone && (
                        <p className="text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 my-2">
                      <p>
                        Email <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && (
                        <p className="text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div className="flex-1 my-2">
                      <p>
                        Password <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {errors.password && (
                        <p className="text-red-500">{errors.password}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 my-2">
                      <p>
                        Account Limit <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        placeholder="Enter Account Limit"
                        value={accountLimit}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                          setAccountLimit(value); // Ensure this is a string
                        }}
                      />
                      {errors.accountLimit && (
                        <p className="text-red-500">{errors.accountLimit}</p>
                      )}
                    </div>
                    <div className="flex-1 my-2">
                      <p>
                        Website Used For Payments{" "}
                        <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        placeholder="Website use for payment"
                        value={websiteUseForPayment}
                        onChange={(e) =>
                          setWebsiteUseForPayment(e.target.value)
                        }
                      />
                      {errors.websiteUseForPayment && (
                        <p className="text-red-500">
                          {errors.websiteUseForPayment}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="my-2">
                    <p>
                      Merchant Website <span className="text-[#D50000]">*</span>
                    </p>
                    <Input
                      placeholder="Enter merchant website here"
                      value={merchantWebsite}
                      onChange={(e) => setMerchantWebsite(e.target.value)}
                    />
                    {errors.merchantWebsite && (
                      <p className="text-red-500">{errors.merchantWebsite}</p>
                    )}
                  </div>

                  <div className="my-2">
                    <p>
                      Image <span className="text-[#D50000]">*</span>
                    </p>
                    <Input
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    {errors.image && (
                      <p className="text-red-500">{errors.image}</p>
                    )}
                  </div>

                  <div className="my-2">
                    <p>
                      Admin Commission (%) <span className="text-[#D50000]">*</span>
                    </p>
                    <Input
                      type="number"
                      suffix={"%"}
                      step={0.01}
                      min={0}
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                    />
                    {errors?.tax && (
                      <p className="text-red-500">{errors?.tax}</p>
                    )}
                  </div>
                  <div className="my-2">
                    <p>
                      Payout Commission (%) <span className="text-[#D50000]">*</span>
                    </p>
                    <Input
                      type="number"
                      suffix={"%"}
                      // step={0.01}
                      // min={0}
                      value={payoutCommision}
                      onChange={(e) => setPayoutCommision(e.target.value)}
                    />
                    {errors?.payoutCommision && (
                      <p className="text-red-500">{errors?.payoutCommision}</p>
                    )}
                  </div>
                </Modal>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#ECF0FA]">
                  <tr>
                    <th className="p-3 text-[13px] font-[600] text-nowrap">
                      Merchant Name
                    </th>
                    {/* <th className="p-5 text-[13px] font-[600] text-nowrap">
                      Bank Accounts
                    </th> */}
                    <th className="p-5 text-[13px] font-[600] text-nowrap">
                      Merchant Website
                    </th>
                    <th className="p-5 text-[13px] font-[600] text-nowrap">
                      Website For Payment
                    </th>
                    <th className="p-5 text-[13px] font-[600]">Limit</th>
                    <th className="p-5 pl-2 text-[13px] font-[600] text-nowrap">Pay-In-Commission</th>
                    <th className="p-5 pl-2 text-[13px] font-[600] text-nowrap">Pay-Out-Commission</th>
                    <th className="p-5 text-[13px] font-[600]">Status</th>
                    <th className="p-5 text-[13px] font-[600]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMerchants?.length > 0 ? (
                    filteredMerchants.map((merchant, index) => (
                      <tr
                        key={index}
                        className={`border-t border-b ${index % 2 === 0 ? "bg-white" : ""
                          }`}
                      >
                        <td className="p-3 text-[13px] font-[600]">
                          <div className="flex items-center space-x-2 flex-wrap md:flex-nowrap">
                            <span className="whitespace-nowrap">
                              {merchant.merchantName}
                            </span>
                          </div>
                        </td>
                        {/* <td className="p-3 text-[13px] pl-8">
                          {merchant.accounts}
                        </td> */}
                        <td className="p-3 text-[13px]">
                          <a
                            href={`https://${merchant.merchantWebsite}`}
                            className="text-blue-500 hover:underline pl-2"
                          >
                            {merchant.merchantWebsite}
                          </a>
                        </td>
                        <td className="p-3 text-[13px] font-[400]">
                          <span className="pl-2">{merchant.website}</span>
                        </td>
                        <td className="p-3 text-[13px] font-[400] text-nowrap">
                          ₹ {merchant.accountLimit}
                        </td>
                        <td className="p-3 text-[13px] font-[400]">
                          {merchant.commision}%
                        </td>
                        <td className="p-3 text-[13px] font-[400]">
                          {merchant.payoutCommision}%
                        </td>
                        <td className="text-center">
                          <button
                            className={`px-3 py-[5px] rounded-[20px] w-20 flex items-center justify-center text-[11px] font-[500] ${!merchant.block
                              ? "bg-[#10CB0026] text-[#0DA000]"
                              : "bg-[#FF173D33] text-[#D50000]"
                              }`}
                          >
                            {!merchant.block ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center items-center">
                            <Switch
                              size="small"
                              defaultChecked={!merchant?.block}
                              onChange={async (checked) => {
                                const response = await fn_MerchantUpdate(
                                  merchant?._id,
                                  { block: !checked }
                                );
                                if (response?.status) {
                                  fn_getMerchant();
                                  notification.success({
                                    message: "Status",
                                    description: "Merchant Status Updated!",
                                    placement: "topRight",
                                  });
                                }
                              }}
                            />
                            <button
                              className="bg-green-100 text-green-600 rounded-full px-2 py-2 mx-2"
                              title="Edit"
                              onClick={() => {
                                setSelectedMerchant(merchant);
                                setMerchantName(merchant.merchantName);
                                setPhone(merchant.phone);
                                setEmail(merchant.email);
                                setPassword(merchant.password);
                                setAccountLimit(merchant.accountLimit);
                                setWebsiteUseForPayment(merchant.website);
                                setMerchantWebsite(merchant.merchantWebsite);
                                setTax(merchant.commision);
                                setPayoutCommision(merchant.payoutCommision);
                                setOpen(true);
                              }}
                            >
                              <FiEdit />
                            </button>
                            <button className="bg-indigo-100 text-indigo-700 text-nowrap hover:bg-indigo-200 rounded px-3 py-1.5 mx-2 font-medium transition-colors duration-200 text-center flex items-center justify-center"
                              onClick={() => {
                                window.open(
                                  `https://merchant.royal247.org/login?email=${encodeURIComponent(merchant.email)}&password=${encodeURIComponent(merchant.password)}`,
                                  "_blank"
                                );
                              }}
                            >
                              Access Dashboard
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center p-3">
                        No merchants found
                      </td>
                    </tr>
                  )}
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
