import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Form, notification, Popconfirm } from "antd";

import { FiEdit } from "react-icons/fi";
import { FaExclamationCircle, FaTrash } from "react-icons/fa";
import { fn_createCurrencyExchange, fn_getAllCurrencyExchange, fn_deleteCurrencyExchange, fn_editCurrencyExchange } from "../../api/api";

const CurrencyExchange = ({ authorization, showSidebar }) => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currencies, setCurrencies] = useState([]);
    const containerHeight = window.innerHeight - 120;
    const [editModal, setIsEditModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    useEffect(() => {
        window.scroll(0, 0);
        if (!authorization) {
            navigate("/login");
        }
        fetchCurrencies();
    }, []);

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

    const handleAddCurrency = () => {
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setIsEditModal(false);
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

    const fn_editCall = async (item) => {
        setIsEditModal(true);
        setSelectedCurrency(item);
        form.setFieldValue('currency', item?.currency);
        form.setFieldValue('currencyRate', item?.currencyRate);
        form.setFieldValue('charges', item?.charges);
    };

    const handleModalEdit = async () => {
        try {
            const values = await form.validateFields();
            const response = await fn_editCurrencyExchange(selectedCurrency?._id, {
                currency: values.currency,
                currencyRate: values.currencyRate,
                charges: values.charges,
                adminId: Cookies.get("adminId")
            });

            if (response.status) {
                fetchCurrencies();
                notification.success({
                    message: 'Success',
                    description: response.message || 'Currency Updated successfully',
                });
                setIsModalOpen(false);
                setIsEditModal(false);
                form.resetFields();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to update currency',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Please fill all required fields',
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
                                            <th className="p-4 text-[13px] font-[600]">Commission (%)</th>
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
                                                    <td className="p-4 text-[13px]">1 {currency?.currency} = {currency?.currencyRate} INR</td>
                                                    <td className="p-4 text-[13px]">{currency?.charges}%</td>
                                                    <td className="p-4 text-[13px] flex items-center gap-[10px]">
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
                                                        <FiEdit className="text-[24px] bg-green-300 p-[5px] rounded-[3px] text-green-800 cursor-pointer" onClick={() => fn_editCall(currency)} />
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

            {/* create modal */}
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
                        label={`Currency Rate`}
                        name="currencyRate"
                        rules={[{ required: true, message: 'Please enter currency rate' }]}
                    >
                        <Input placeholder="Equal to How much INRs ?" />
                    </Form.Item>

                    <Form.Item
                        label="Commission (%)"
                        name="charges"
                        rules={[{ required: true, message: 'Please enter commission' }]}
                    >
                        <Input placeholder="Enter Commission in Percentage" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* edit modal */}
            <Modal
                title="Edit Currency"
                open={editModal}
                onOk={handleModalEdit}
                onCancel={handleModalCancel}
                okText="Edit Currency"
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
                        label="Currency Rate"
                        name="currencyRate"
                        rules={[{ required: true, message: 'Please enter currency rate' }]}
                    >
                        <Input placeholder="Equal to How much INRs ?" />
                    </Form.Item>

                    <Form.Item
                        label="Commission (%)"
                        name="charges"
                        rules={[{ required: true, message: 'Please enter commission' }]}
                    >
                        <Input placeholder="Enter Commission in Percentage" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CurrencyExchange;
