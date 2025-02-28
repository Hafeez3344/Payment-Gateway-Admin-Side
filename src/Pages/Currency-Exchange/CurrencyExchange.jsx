import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Form, notification, Popconfirm } from "antd";
import { FaExclamationCircle, FaTrash } from "react-icons/fa";
import { fn_createCurrencyExchange, fn_getAllCurrencyExchange, fn_deleteCurrencyExchange } from "../../api/api";
import Cookies from "js-cookie";

const CurrencyExchange = ({ authorization, showSidebar }) => {
    const containerHeight = window.innerHeight - 120;
    const [currencies, setCurrencies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchCurrencies = async () => {
        setLoading(true);
        try {
            const response = await fn_getAllCurrencyExchange();
            if (response.status) {
                setCurrencies(response.data);
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to fetch currencies',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to fetch currencies',
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const handleAddCurrency = () => {
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await fn_createCurrencyExchange({
                currency: values.currency,
                currencyRate: values.currencyRate,
                charges: values.charges,
                adminId: Cookies.get("adminId")
            });

            if (response.status) {
                fetchCurrencies(); 
                notification.success({
                    message: 'Success',
                    description: response.message || 'Currency added successfully',
                });
                setIsModalOpen(false);
                form.resetFields();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to add currency',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Please fill all required fields',
            });
        }
    };

    const handleDelete = async (currencyId) => {
        try {
            const response = await fn_deleteCurrencyExchange(currencyId);
            if (response.status) {
                notification.success({
                    message: 'Success',
                    description: response.message
                });
                fetchCurrencies(); // Refresh the list after deletion
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to delete currency'
            });
        }
    };

    return (
        <>
            <div
                className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
                    }`}
                style={{ minHeight: `${containerHeight}px` }}
            >
                <div className="p-7">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
                        <h1 className="text-[25px] font-[500]">Currency Exchange</h1>
                        <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
                            Dashboard - Currency Exchange
                        </p>
                    </div>

                    {/* Add Currency button outside table */}
                    <div className="flex justify-end mb-4">
                        <Button type="primary" onClick={handleAddCurrency}>
                            Add Currency
                        </Button>
                    </div>

                    <div className="flex flex-col gap-7 md:flex-row bg-gray-100">
                        <div className="w-full bg-white rounded-lg shadow-md border">
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#ECF0FA]">
                                        <tr>
                                            <th className="p-4 text-[13px] font-[600]">Currency</th>
                                            <th className="p-4 text-[13px] font-[600]">Currency Rate</th>
                                            <th className="p-4 text-[13px] font-[600]">Charges (INR)</th>
                                            <th className="p-4 text-[13px] font-[600]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currencies?.length > 0 ? (
                                            currencies.map((currency, index) => (
                                                <tr
                                                    key={currency._id}
                                                    className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                                >
                                                    <td className="p-4 text-[13px]">{currency?.currency}</td>
                                                    <td className="p-4 text-[13px]">1 INR = {currency?.currencyRate}{" "}{currency?.currency}</td>
                                                    <td className="p-4 text-[13px]">{currency?.charges}</td>
                                                    <td className="p-4 text-[13px]">
                                                        <Popconfirm
                                                            title="Delete Currency"
                                                            description="Are you sure you want to delete this currency?"
                                                            onConfirm={() => handleDelete(currency._id)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <Button 
                                                                type="primary" 
                                                                danger 
                                                                icon={<FaTrash />}
                                                                size="small"
                                                            />
                                                        </Popconfirm>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                                    <FaExclamationCircle className="inline-block mr-2" />
                                                    {loading ? 'Loading currencies...' : 'No currencies found'}
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
                title="Add New Currency"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Add Currency"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        label="Currency"
                        name="currency"
                        rules={[{ required: true, message: 'Please enter currency' }]}
                    >
                        <Input placeholder="Enter currency" />
                    </Form.Item>

                    <Form.Item
                        label="Currency Rate (1 INR = ?)"
                        name="currencyRate"
                        rules={[{ required: true, message: 'Please enter currency rate' }]}
                    >
                        <Input placeholder="Enter currency rate" />
                    </Form.Item>

                    <Form.Item
                        label="Charges (INR)"
                        name="charges"
                        rules={[{ required: true, message: 'Please enter charges' }]}
                    >
                        <Input placeholder="Enter charges" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CurrencyExchange;
