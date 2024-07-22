import { LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Select, Space, Spin, Table, Tag, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { Option } from 'antd/es/mentions';
import moment from 'moment';

const token = JSON.parse(localStorage.getItem("token"))?.token;
const userId = JSON.parse(localStorage.getItem("token"))?.userId;

const RequestFeedback = () => {
  const [requestData, setRequestData] = useState([]);
  const navigate = useNavigate();
  const [managerEmails, setManagerEmails] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: 'S.no.',
      dataIndex: 'serialNumber',
      width: 100,
    },
    {
      title: 'Provider',
      dataIndex: 'feedbackProviderName',
      width: 200,
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      width: 200,
      render: (_, record) => (
        <>
            <span className="">
                {moment(record?.requestDate).format('YYYY-MM-DD')}
            </span>
            <span className='ms-3'>
                {moment(record?.requestDate).format('hh:mm A')}
            </span>
        </>
    ),
    sorter: (a, b) => moment(a.requestDate).unix() - moment(b.requestDate).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'requestStatus',
      render: (_, record) => (
        record?.requestStatus && (record?.requestStatus == 'REQUESTED')?
        <Tag color="#f50">{record.requestStatus}</Tag>
        : <Tag color="#87d068">{record.requestStatus}</Tag>
      )
    }
  ];
  const onFinish = async (values) => {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    const userId = JSON.parse(localStorage.getItem("token"))?.userId;
    setLoading(true);
    await axios.post(`http://localhost:8080/api/feedbackRequest/add`,
      {
        "message": values.message,
        "feedbackSeekerId": userId,
        "feedbackProviderEmail": values.providerEmail
      },
      { headers: { "Authorization": `Bearer ${token}` } })
      .then(response => {
        // console.log(response);
        setLoading(false);
        if (response) {
          message.success(
            {
              content: 'Email Sent Successfully!',
              style: {
                marginTop: '20px', // Adjust as needed
              },
            }
          );
        }
      })
      .catch(err => {
        message.error('Error Sending Mail!');
        console.log(err);
      });
      form.resetFields();
      fetchData();
  }

  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    const userId = JSON.parse(localStorage.getItem("token"))?.userId;
    // console.log(userId);
    await axios.get(`http://localhost:8080/api/feedbackRequest/get/${userId}`,
      { headers: { "Authorization": `Bearer ${token}` } })
      .then(response => response?.data.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)))
      .then(data => {
        setRequestData(data?.map((item, index) => ({
          ...item,
          serialNumber: index + 1
      })));
      })
      .catch(err => {
        console.log(err);
      });
  }

  useCallback(() => { fetchData() }, [fetchData, requestData])
  useEffect(() => { fetchData() }, []);

  useEffect(() => {
    fetchManagerEmails();
  }, []);

  const fetchManagerEmails = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const emails = await UserService.getAllActiveUserEmails(token?.token);
      setManagerEmails(emails.filter(item=>item?.firstName!=currentUser?.firstName));
    } catch (error) {
      console.error('Error fetching manager emails:', error);
    }
  };
  return (
    <>
      <div><h2>Request Feedback</h2></div>
      <Button className='mt-2 btn-primary' onClick={() => navigate('/feedback')}>
        <LeftOutlined />
      </Button>
      <div className='row d-flex justify-content-around pt-3'>
        <div className='col-7 p-2 column-gap-lg-5 shadow-sm'>
          <h5 className='text-center'>Sent Requests</h5>
          <div className='p-4'>
            <Table
              columns={columns}
              dataSource={(requestData)?requestData:[]}
              pagination={{
                pageSize: 5,
              }}
              scroll={{
                y: 240,
              }}
            />
          </div>
        </div>
        <div className='col-4 p-2 shadow-sm'>
          <h5 className='text-center'>Send Request</h5>
          <div className='p-4'>
          <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="small" >
            <Form
            form={form}
              name="requestForm"
              layout="vertical"
              onFinish={onFinish}
              labelCol={{
                span: 10,
              }}
              wrapperCol={{
                span: 25,
              }}
            >
              <Form.Item
                label="Request From"
                name="providerEmail"
                rules={[{ required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please input a valid email!' }]}
              >
                <Select placeholder="Select email">
                  {managerEmails.map(email => (
                    <Option key={email} value={email}>{email}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Message"
                name="message"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <TextArea placeholder='add message' />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Send
                  </Button>
                  <Button htmlType="button" >
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Form>
            </Spin>
          </div>
        </div>
      </div>
    </>
  )
}

export default RequestFeedback