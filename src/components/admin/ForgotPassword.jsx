import React from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Success:', values);
    notification.success({
      message: 'Password Reset',
      description: 'A link to reset your password has been sent to your email.',
    });
    navigate('/');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleBackToSignIn = () => {
    navigate('/');
  };

  return (
    <div className='mainBgImg' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
      <div className='bg-light p-4 rounded' style={{boxShadow:'4px 4px 10px rgba(0,0,0,0.5)'}}>
        <Title level={2}>PMS</Title>
        <Text>Enter your email address and we’ll send you a link to reset your password.</Text>
        <div className="p-4" style={{ width: '100%', maxWidth: '480px', marginTop: '20px', borderRadius: '8px', boxShadow: '1px 1px 10px 3px #cacadc' }}>
          <Form
            name="reset_password"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              label="Enter Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
          <Link onClick={handleBackToSignIn} style={{ display: 'block', textAlign: '', marginTop: '10px' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
