import { fn_getMerchantApi, fn_updateMerchantCommissionApi } from "../../api/api";
import React, { useState, useEffect } from "react";
import { Button, Modal, Input, notification, Select } from "antd";

const Commission = ({ showSidebar }) => {
  const [open, setOpen] = useState(false);
  const [allMerchants, setAllMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [commissionValue, setCommissionValue] = useState("");
  const [loading, setLoading] = useState(false);
  const containerHeight = window.innerHeight - 120;

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const result = await fn_getMerchantApi();
      if (result?.status) {
        const merchantsWithCommission = result?.data?.data?.map((item) => {
          return {
            value: item._id,
            label: item?.merchantName,
            commision: item?.commision || ""
          };
        });
        setAllMerchants(merchantsWithCommission);
      }
    } catch (error) {
      console.error("Error fetching merchants:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch merchants",
        placement: "topRight",
      });
    }
  };

  const handleAddAccount = () => {
    setOpen(true);
    setSelectedMerchant("");
    setCommissionValue("");
  };

  const handleMerchantChange = (value) => {
    console.log('Selected Merchant:', value);
    setSelectedMerchant(value);
  };

  const handleCommissionChange = (e) => {
    console.log('Commission Value:', e.target.value);
    setCommissionValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedMerchant || !commissionValue) {
      notification.error({
        message: "Error",
        description: "Please fill all required fields",
        placement: "topRight",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fn_updateMerchantCommissionApi(selectedMerchant, commissionValue);

      if (response.status) {
        notification.success({
          message: "Success",
          description: "Commission updated successfully",
          placement: "topRight",
        });

        // Refresh merchants list to get updated data
        await fetchMerchants();
        setOpen(false);
      } else {
        notification.error({
          message: "Error",
          description: response.message || "Failed to update commission",
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update commission",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"}`}
        style={{ minHeight: `${containerHeight}px` }}
      >
        <div className="p-7">
          <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
            <h1 className="text-[25px] font-[500]">Pay-In</h1>
            <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
              Dashboard - Data Table
            </p>
          </div>
          <div className="flex flex-col gap-7 md:flex-row bg-gray-100">
            <div className="w-full bg-white rounded-lg shadow-md border">
              {/* Header */}
              <div className="p-3 flex justify-between border-b text-[20px] font-[500]">
                <p>Merchant Pay-In Charges Table</p>
                <div><Button type="primary" onClick={handleAddAccount}>
                  Update Merchant Charges
                </Button></div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#ECF0FA]">
                    <tr>
                      <th className="p-3 text-[13px] font-[600]">S.No</th>
                      <th className="p-3 text-[13px] font-[600]">Merchant Name</th>
                      <th className="p-3 text-[13px] font-[600]">Pay-in Charges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allMerchants.map((merchant, index) => (
                      <tr key={merchant.value} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-[13px]">{index + 1}</td>
                        <td className="p-3 text-[13px]">{merchant.label}</td>
                        <td className="p-3 text-[13px]">{merchant.commision ? `${merchant.commision}%` : "0%"}</td>
                      </tr>
                    ))}
                    {allMerchants.length === 0 && (
                      <tr>
                        <td colSpan="3" className="p-3 text-center text-gray-500">
                          No merchants available
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

      <Modal
        centered
        width={450}
        open={open}
        title={<p className="text-[16px] font-[700]">Update Merchant Commission</p>}
        footer={
          <div className="flex gap-4 mt-6">
            <Button
              className="flex start px-6 text-[12px]"
              type="primary"
              onClick={handleSubmit}
              loading={loading}
            >
              Submit
            </Button>
            <Button
              className="flex start px-6 bg-white text-[#FF3D5C] border border-[#FF7A8F] text-[12px]"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        }
        onCancel={() => setOpen(false)}
      >
        <div className="flex gap-4">
          <div className="flex-1 my-2">
            <p className="text-[12px] font-[500] pb-1">
              Select Merchant <span className="text-[#D50000]">*</span>
            </p>
            <Select
              placeholder="Select Merchant"
              className="w-full text-[12px]"
              value={selectedMerchant}
              onChange={handleMerchantChange}
              options={[
                { value: "", label: "Select Merchant", disabled: true },
                ...allMerchants
              ]}
            />
          </div>
        </div>
        <div className="flex-1 my-2">
          <p className="text-[12px] font-[500] pb-1">
            Charges <span className="text-[#D50000]">*</span>
          </p>
          <div className="relative">
            <Input
              placeholder="Enter Charges"
              className="pr-6"
              value={commissionValue}
              onChange={handleCommissionChange}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Commission;
