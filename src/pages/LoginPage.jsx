import React, { useState } from 'react';
import { Form, Input, Button, Typography, Divider, message } from 'antd';
import baseUrl from "../api/bootapi";
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import UserService from '../services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../components/redux/AuthSlice';

const { Title, Link } = Typography;

function LoginPage() {
  const reduxToken = useSelector((state) => state.token.value);
  const reduxAuth = useSelector((state) => state.auth.value);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    await axios.post(`${baseUrl}/api/auth/login`, values).then(res => res.data).then(
      (response) => {
        dispatch(login(response.token));
        // console.log(dispatch(setTokenSlice(response.token)));
        localStorage.setItem('token', JSON.stringify(response));

        setUserId(response.userId);

        UserService.getUserById(response.token, response.userId)
          .then(userResponse => {
            // console.log('User data login:', userResponse.data);
            localStorage.setItem("currentUser", JSON.stringify(userResponse.data));
            if (userResponse.data.role.name === "USER") {
              if(userResponse.data.job==="HR"){
                navigate("/hrpage");
              }
              else{
                navigate("/home");
              }
            }
            else {
              navigate("/admin");
            }
            Swal.fire({
              icon: 'success',
              title: 'Sign in success',
              showConfirmButton: false,
              timer: 1000
            });
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });

      }, (error) => {
        console.log("Error! Something went wrong");
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong!',
          text: 'Login Failed .',
        });
        console.log(error)
      }
    )
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleForgotPassword = () => {
    navigate("/forgotPassword");
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center loginBg">
      <div className="row loginShadow" style={{ width: '800px' }}>
        <div className="col-md-6 loginBlueColor text-white p-5 d-flex flex-column justify-content-center align-items-center register-container">
          <Title level={1} className='text-white'>Welcome to PMS</Title>
          <Title level={5} className='text-white m-0 p-0'>To get started, please sign in</Title>
        </div>
        <div className="col-md-6 p-5">
          <div style={{ display: 'flex ', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
              {/* <GoogleSign /> */}
              {/* <Divider className='m-0 p-0'>or</Divider> */}
              <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please input a valid email!' }]}
                  className='m-0 p-0'
                  style={{fontWeight:'600'}}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                  className='m-0 p-0'
                  style={{fontWeight:'600'}}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Link onClick={handleForgotPassword} className="float-left " style={{fontWeight:'600'}}>Forgot Password?</Link>
                </Form.Item>

                <Form.Item>
                  <Button htmlType="submit" style={{ width: '100%', fontSize: '18px' }} className='btn btn-primary p-0 signInButton' >
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;