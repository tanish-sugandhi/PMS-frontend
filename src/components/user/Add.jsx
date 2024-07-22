import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';
import baseUrl from '../../api/bootapi';
import Swal from 'sweetalert2';
import UserService from '../../services/UserService'; 

const { Option } = Select;

const Add = ({ onClose, viewAllEmployee }) => {
    const [form] = Form.useForm();
    const [managerEmails, setManagerEmails] = useState([]);

    useEffect(() => {
        fetchManagerEmails();
    }, []);

    const fetchManagerEmails = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            const emails = await UserService.getAllActiveUserEmails(token.token);
            setManagerEmails(emails);
        } catch (error) {
            console.error('Error fetching manager emails:', error);
        }
    };

    const onFinish = (values) => {
        const formattedValues = {
            ...values,
            hiredDate: values.hiredDate.format('YYYY-MM-DD'),
            role: {
                name: values.role
            }
        };

        const token = JSON.parse(localStorage.getItem("token"));
        axios.post(`${baseUrl}/api/user/register`, formattedValues,
            {
                headers: { Authorization: `Bearer ${token.token}` },
            }
        ).then(
            (response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Employee created successfully',
                    showConfirmButton: false,
                    timer: 1000
                });
                form.resetFields();
                viewAllEmployee(token.token); 
                onClose();
            },
            (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Something went wrong!',
                    text: error.response.data,
                });
            }
        );
    };

    const validatePassword = (_, value) => {
        if (!value) {
            return Promise.reject('Please input your password!');
        }
        if (value.length < 6) {
            return Promise.reject('Password must be at least 6 characters long!');
        }
        if (value.length > 12) {
            return Promise.reject('Password cannot exceed 12 characters!');
        }
        if (!/[A-Z]/.test(value)) {
            return Promise.reject('Password must contain at least one uppercase letter!');
        }
        if (!/[a-z]/.test(value)) {
            return Promise.reject('Password must contain at least one lowercase letter!');
        }
        if (!/[0-9]/.test(value)) {
            return Promise.reject('Password must contain at least one digit!');
        }
        if (!/[!@#$%^&*]/.test(value)) {
            return Promise.reject('Password must contain at least one special character!');
        }
        return Promise.resolve();
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                <Form
                    form={form}
                    name="create"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                            { required: true, message: 'Please input your first name!' },
                            { pattern: /^[A-Za-z]+$/, message: 'Please input a valid first name!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                            { required: true, message: 'Please input your last name!' },
                            { pattern: /^[A-Za-z]+$/, message: 'Please input a valid last name!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { validator: validatePassword }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Contact"
                        name="contact"
                        rules={[
                            { required: true, message: 'Please input your contact!' },
                            { pattern: /^[0-9]{10}$/, message: 'Please input a valid 10-digit mobile number!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Job"
                        name="job"
                        rules={[{ required: true, message: 'Please select your job!' }]}
                    >
                        <Select placeholder="Select your job">
                            <Option value="HR">HR</Option>
                            <Option value="Manager">Manager</Option>
                            <Option value="Tester">Tester</Option>
                            <Option value="Software Developer">Software Developer</Option>
                            <Option value="System Analyst">System Analyst</Option>
                            <Option value="Network Engineer">Network Engineer</Option>
                            <Option value="Database Administrator">Database Administrator</Option>
                            <Option value="IT Support">IT Support</Option>
                            <Option value="Cybersecurity Specialist">Cybersecurity Specialist</Option>
                            <Option value="Cloud Engineer">Cloud Engineer</Option>
                            <Option value="IT Project Manager">IT Project Manager</Option>
                            <Option value="QA Engineer">QA Engineer</Option>
                            <Option value="Data Scientist">Data Scientist</Option>
                            <Option value="AI/ML Engineer">AI/ML Engineer</Option>
                            <Option value="Web Developer">Web Developer</Option>
                            <Option value="IT Consultant">IT Consultant</Option>
                            <Option value="ERP Consultant">ERP Consultant</Option>
                            <Option value="UX/UI Designer">UX/UI Designer</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Hired Date"
                        name="hiredDate"
                        rules={[{ required: true, message: 'Please input your hired date!' }]}
                    >
                        <DatePicker 
                        //   disabledDate={(current) => current && current < moment().startOf('day')}
                        disabledDate={(current) =>  moment().startOf('day') < current}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Manager Email"
                        name="managerEmail"
                        rules={[
                            { required: true, message: 'Please input your manager\'s email!' },
                            { type: 'email', message: 'Please input a valid email!' }
                        ]}
                    >
                        <Select placeholder="Select manager's email">
                            {managerEmails.map(email => (
                                <Option key={email} value={email}>{email}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select the role!' }]}
                    >
                        <Select placeholder="Select a role">
                            <Option value="ADMIN">ADMIN</Option>
                            <Option value="USER">USER</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Add;
