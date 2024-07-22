import { CheckCircleFilled, CloseCircleOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Drawer, Table, DatePicker, Flex, Form, Input, Rate, Segmented, Select, message, Collapse, Tag, Tabs } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { saveUserFeedback } from '../../services/FeedbackService';
import UserService from '../../services/UserService';
import { getUserGoals } from '../../services/GoalService';
import { green } from '@mui/material/colors';
import { useForm } from 'antd/es/form/Form';

const { TextArea } = Input;
const { Option } = Select;

const ProvideFeedback = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [placement, setPlacement] = useState('right');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formManager] = Form.useForm();
  const [formRequested] = Form.useForm();
  // Initialize the state with the first option selected
  const [selectedOption, setSelectedOption] = useState('Requested Feedback');
  // Function to handle option changes
  const handleOptionChange = (newOption) => {
    setSelectedOption(newOption);
  };
  return (
    <>
      <div>
        <h2>Provide Feedback</h2>
      </div>
      <Button className='mt-2 btn-primary' onClick={() => navigate('/feedback')}>
        <LeftOutlined />
      </Button>
      <div className='mt-4'>
        <RequestedFeedbackComponent />
      </div>
    </>
  )
}

const RequestedFeedbackComponent = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [placement, setPlacement] = useState('right');
  const [requestData, setRequestData] = useState([]);
  const [seekerData, setSeekerData] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  //To find all years from the goals
  const [yearlyRecord, setYearlyRecord] = useState([]);

  const onFinish = (values) => {
    const userId = JSON.parse(localStorage.getItem("token"))?.userId;
    const payload = {
      "providerId": userId,
      "rating": values.rating,
      "userId": seekerData.feedbackSeekerId,
      "comments": values.comments,
      "feedbackType": 'FEEDBACK_360'
    }
    const response = saveUserFeedback(payload);
    if (response) {
      updateStatus(seekerData.requestId)
      message.success('Feedback Provided!');
    }
    else {
      message.error('Not able to send feedback, Try again later!')
    }
    form.resetFields();
    onClose();
    // console.log('Received values of form: ', payload);
  };
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };
  const addFeedback = (values) => {
    setSeekerData(values);
    setOpenDrawer(true);
  }
  // console.log(seekerData);
  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    const userId = JSON.parse(localStorage.getItem("token"))?.userId;
    // console.log(userId);
    await axios.get(`http://localhost:8080/api/feedbackRequest/get/provider/${userId}`,
      { headers: { "Authorization": `Bearer ${token}` } })
      .then(response => response?.data.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)))
      .then(data => {
        // console.log(data);
        setRequestData(data?.map((item, index) => ({
          ...item,
          // serialNumber: index + 1,
          year: new Date(item?.requestDate).getFullYear()
        })));
        const years = data?.map(item => new Date(item?.requestDate).getFullYear());
        const uniqueYearsSet = new Set(years);
        setYearlyRecord(Array.from(uniqueYearsSet));
      })
      .catch(err => {
        console.log(err);
      });
  }
  const updateStatus = async (recordId) => {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    await axios.get(`http://localhost:8080/api/feedbackRequest/updateStatus/${recordId}`,
      {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => console.log(res))
      .catch(err => {
        console.log(err);
      });
    fetchData();
  }
  useCallback(() => { fetchData() }, [fetchData, requestData])
  useEffect(() => { fetchData() }, []);
  // console.log("request data",requestData);
  const columns = [
    {
      title: 'S.no.',
      dataIndex: 'serialNumber',
      width: 70,
    },
    {
      title: 'Request from',
      dataIndex: 'feedbackSeekerName',
      width: 170,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Requested Date',
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
      width: 100,
      render: (_, record) => (
        record?.requestStatus && (record?.requestStatus == 'REQUESTED') ?
          <Tag color="#f50">{record.requestStatus}</Tag>
          : <Tag color="#87d068">{record.requestStatus}</Tag>
      )
    },
    {
      title: 'Action',
      width: 130,
      render: (_, record) =>
      (
        record && record?.requestStatus === 'REQUESTED' ? (
          <div className='text-center'>
            <Button className='btn-primary me-2' onClick={() => addFeedback(record)}>
              <PlusOutlined />
            </Button>
            <Button className='btn-danger'>
              <CloseCircleOutlined />
            </Button>
          </div>
        ) : (
          <div className='text-center'>
            <CheckCircleFilled style={{ fontSize: '25px', color: '#008000' }} />
          </div>
        )
      )
    }
  ];
  // console.log(seekerData);
  const getFilteredDataByYear = (year) => {
    return requestData?.filter(item => item.year == year).map((item, index) => ({
      ...item,
      serialNumber: index + 1,
  }));
  }
  return (
    <div>
      <div className='mt-4'>
        <div className='mt-2'>
          {requestData?.length == 0 ? <Table
            columns={columns}
            dataSource={null}
            style={{ overflow: 'visible', width: '100%', fontSize: '16px' }}
            scroll={{
              y: 300,
            }}
            pagination={{
              pageSize: 5
            }}
          ></Table>
            :
            <Tabs
              defaultActiveKey="0"
              tabPosition={'top'}
              style={{
                height: 220,
              }}
              items={yearlyRecord?.map((year, i) => {
                const id = String(i);
                return {
                  label: `${year}`,
                  key: id,
                  children:
                    <Table
                      columns={columns}
                      dataSource={getFilteredDataByYear(year)}
                      pagination={{
                        pageSize: 5,
                      }}
                      scroll={{
                        y: 240,
                      }}
                    />
                };
              })}
            />
          }
        </div>

      </div>
      <Drawer
        title="Provide Feedback"
        width={520}
        styles={{
          body: {
            paddingBottom: 80,
          }
        }}
        placement={placement}
        closable={false}
        onClose={onClose}
        open={openDrawer}
        key={placement}
      >
        <div className='mt-4'>
          <Form
            form={form}
            name="feedback_form"
            layout="horizontal"
            onFinish={onFinish}
            initialValues={{
              feedbackSeekerName: seekerData?.feedbackSeekerName,
              type: 'FEEDBACK_360',
            }}
            width='400'
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 14,
            }}
          >
            <Form.Item
              name="providerName"
              label="Feeder Seeker"
            >
              <Input placeholder={seekerData?.feedbackSeekerName} disabled />
            </Form.Item>
            <Form.Item
              name="feedbackType"
              label="Feedback Type"
            >
              <Input disabled placeholder='Peer Feedback'></Input>
            </Form.Item>

            <Form.Item
              name="comments"
              label="Comment"
              rules={[{ required: true, message: 'Please input your comment!' }]}
            >
              <TextArea rows={4} placeholder="Your comments" />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please provide a rating!' }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  );
}

export default ProvideFeedback