import { Button, Menu, Dropdown, Input, Modal, Form } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { UserOutlined, ProfileOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setTokenSlice } from '../redux/TokenSlice';
import { logout } from '../redux/AuthSlice';
import { BellFilled } from '@ant-design/icons';

const token = JSON.parse(localStorage.getItem("token"))?.token;

const HeaderComponent = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    UserService.changePassword(token, userData.email, oldPassword, newPassword, confirmPassword)
      .then(() => {
        setIsModalOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password changed successfully',
          showConfirmButton: false,
          timer: 1000
        });
        form.resetFields();
      })
      .catch(error => {
        console.error('Error changing password:', error);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("currentUser"));
  if (userData) {
    try {
      // console.log("User Object :::::", userData);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  } else {
    console.log("No user data found in localStorage.");
  }
  const firstName = userData ? userData.firstName : '';
  const lastName = userData ? userData.lastName : '';
  const roleName = userData && userData.role ? userData.role.name : '';

  const handleClick = () => {
    console.log('Icon clicked');
  };
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.clear();
    dispatch(logout());
    navigate("/");
  };

  const handleMyProfileClick = () => {
    navigate("/myProfile");
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <UserOutlined className='me-2' />
        {firstName} {lastName} ({roleName})
      </Menu.Item>
      <Menu.Item key="1" onClick={handleMyProfileClick}>
        <ProfileOutlined className='me-2' />
        My Profile
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogoutClick}>
        <LogoutOutlined className='me-2' />
        Logout
      </Menu.Item>
      <Menu.Item key="3" onClick={showModal}>
        <LockOutlined className='me-2' />
        Change Password
      </Menu.Item>
    </Menu>
  );

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
    <Header style={{ padding: 0, background: 'white', boxShadow: '2px 2px 2px #9fa7ad', overflow: 'hidden' }}>
      <div className='d-flex justify-content-center align-items-center' style={{ width: '100%', height: '50px' }}>

        <div className="col-6 mt-2" style={{marginLeft:'190px'}}>
          <div className="input-group search-input ">
            <input type="text" className="form-control" placeholder="Search Here" />
          </div>
        </div>
        <div className="mt-4">
          <BellFilled style={{ fontSize: '30px',color:'#001529',position:'relative',marginLeft:'240px' }} />
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button className="float-end me-4 mt-3" style={{ height: '45px', width: '45px', borderRadius: '50%', border: 'none', backgroundColor: '#001529', position: 'absolute', right: '0px' }}>
            <i className="fa-regular fa-user" style={{ color: 'white', fontSize: '20px', cursor: 'pointer' }} onClick={handleClick}></i>
          </Button>
        </Dropdown>
      </div>

      <Modal
        title="Change Password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className=''
      >
        <Form form={form}>
          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: 'Please enter your old password!' }]}
            className='mt-3'
          >
            <Input.Password
              placeholder="Enter Old Password"
              className=''
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              { validator: validatePassword }
            ]}
          >
            <Input.Password
              placeholder="Enter New password"
              className=''
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The two passwords do not match!');
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Enter Confirm password"
              className=''
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>
          <div className='text-center'>
            <Button onClick={handleOk} className='btn btn-dark p-0' style={{ height: '40px', width: '25%' }}>Confirm</Button>
          </div>
        </Form>
      </Modal>
    </Header>
  )
}

export default HeaderComponent
