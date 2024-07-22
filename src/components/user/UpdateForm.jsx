import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import axios from 'axios';
import baseUrl from '../../api/bootapi';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';
import UserService from '../../services/UserService';

const { Option } = Select;

const UpdateForm = ({ employee, onClose, viewAllEmployee }) => {
    const [form] = Form.useForm();
    const location = useLocation();
    const [managerEmails, setManagerEmails] = useState([]);
    const [existingPassword, setExistingPassword] = useState('');

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

    useEffect(() => {
        if (employee) {
            setExistingPassword(employee.password);
            form.setFieldsValue({
                ...employee,
                hiredDate: moment(employee.hiredDate),
                role: employee.role.name,
            });
        }
    }, [employee, form]);

    const onFinish = async (values) => {
        const token = JSON.parse(localStorage.getItem("token"))?.token;
        const formattedValues = {
            ...values,
            hiredDate: values.hiredDate.format('YYYY-MM-DD'),
            role: {
                name: values.role
            },
            password: existingPassword
        };
        await axios.put(`${baseUrl}/api/user/updateUser/${employee.userId}`, formattedValues, { headers: { "Authorization": `Bearer ${token}` } }).then(
            (response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'User updated successfully',
                    showConfirmButton: false,
                    timer: 1000
                });
                viewAllEmployee(token);
                onClose();
            },
            (error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Something went wrong!',
                    text: error.response.data,
                });
            }
        );
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                <Form
                    form={form}
                    name="update"
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
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please input a valid email!' }
                        ]}
                    >
                       <Select placeholder="Select manager's email">
                            {managerEmails
                                .filter(email => email !== employee.email) 
                                .map(email => (
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
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default UpdateForm;
