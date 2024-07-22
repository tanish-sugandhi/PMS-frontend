import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Rate, Table, Form, Drawer, message, Card, Tag, Tabs } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, EyeFilled, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import '../../styles/feedback.css';
import { useNavigate } from 'react-router-dom';
import { getUserGoals } from '../../services/GoalService';
import moment from 'moment';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;
// const token = JSON.parse(localStorage.getItem("token"))?.token;
const EmployeeManagerFeedback = (props) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const employeeRecord = props.data;
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [seekerData, setSeekerData] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [form] = Form.useForm();
    const [openViewDrawer, setOpenViewDrawer] = useState(false);
    const [viewGoalData, setViewGoalData] = useState({});
    //To find all years from the goals
    const [yearlyRecord, setYearlyRecord] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onClose = () => {
        setOpenDrawer(false);
    };

    const onFinish = async (values) => {
        const token = JSON.parse(localStorage.getItem("token"))?.token;
        // console.log(values  );
        const finalGoalData = data?.filter(item => item?.goalName == selectedGoal);
        const response = await axios.put(`http://localhost:8080/api/goals/managerFeedback/${finalGoalData[0]?.goalId}`,
            {
                'managerRating': values.rating,
                'managerComments': values.comment
            },
            { headers: { "Authorization": `Bearer ${token}` } }
        ).then(data => data.data)
            .catch(err => console.log(err));
        if (response) {
            message.success('Thanks for rating yourself!')
            console.log(response);
        }
        else {
            message.error('Not able to provide self rating at present!');
        }
        fetchData();
        form.resetFields();
        setOpenDrawer(false);
    };
    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            width: 68
        },
        {
            title: 'Goal Title',
            dataIndex: 'goalName',
            key: 'goalName',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Rating',
            dataIndex: 'managerRating',
            key: 'managerRating',
            width: 110,
            render: (_, record) => (
                record && record?.managerRating &&
                <Rate disabled defaultValue={record.managerRating} />
            ),
        },
        {
            title: 'Comment',
            dataIndex: 'managerComments',
            key: 'managerComments',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Date Added',
            dataIndex: 'managerFeedbackDate',
            key: 'managerFeedbackDate',
            width: 110,
            render: (_, record) => (
                record?.managerFeedbackDate &&
                <>
                    <span className="">
                        {moment(record?.managerFeedbackDate).format('YYYY-MM-DD')}
                    </span>
                    <span className='ms-3'>
                        {moment(record?.managerFeedbackDate).format('hh:mm A')}
                    </span>
                </>
            )
        },
        currentUser?.job === "HR" ?
            {
                title: 'Status',
                width: 50,
                render: (_, record) =>
                (
                    record && record?.managerRating == null ? (
                        <div className='text-center'>
                            {currentUser?.job === "HR" ? (
                                <CloseCircleFilled style={{ fontSize: '25px', color: '#ca1c1c' }} />
                            ) : (

                                <Button className='btn-primary' onClick={() => addFeedback(record)}>
                                    <PlusOutlined />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className='text-center'>
                            <CheckCircleFilled style={{ fontSize: '25px', color: '#008000' }} />
                        </div>
                    )
                )
            } : {
                title: 'Action',
                width: 50,
                render: (_, record) =>
                ((
                    <div className='text-center'>
                        <CheckCircleFilled style={{ fontSize: '25px', color: '#008000' }} />
                    </div>
                ))
            },
        {
            title: 'More',
            width: 50,
            render: (_, record) =>
            (
                <div className='text-center'>
                    <EyeFilled style={{ fontSize: '23px', color: '#007bff' }} onClick={() => viewGoal(record)} />
                </div>
            )
        }
    ];
    const addFeedback = (values) => {
        setSelectedGoal(values.goalName);
        setSeekerData(values);
        setOpenDrawer(true);
    }
    const fetchData = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"))?.token;
            const response = await getUserGoals(token, employeeRecord.userId).then(res => res)
            // console.log("manager feedback", response);
            setData(response?.map((item, index) => ({
                ...item,
                // serialNumber: index + 1,
                year: new Date(item?.setDate).getFullYear()
            })));
            const years = response?.map(item => new Date(item?.setDate).getFullYear());
            const uniqueYearsSet = new Set(years);
            setYearlyRecord(Array.from(uniqueYearsSet));
        } catch (error) {
            console.error("Error fetching user goals:", error);
        }
    }
    useEffect(() => {
        // console.log("hello folks");
        fetchData();
    }, [])
    const [selectedGoal, setSelectedGoal] = useState(null);
    const handleGoalChange = (value) => {
        setSelectedGoal(value);
    };
    const viewGoal = (values) => {
        console.log(values);
        setViewGoalData(values);
        setOpenViewDrawer(true);
    }
    const onViewClose = () => {
        setOpenViewDrawer(false);
    };
    const getFilteredDataByYear = (year) => {
        return data?.filter(item => item.year == year).map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
    }
    return (
        <>
            <div className=''>
                {data?.length == 0 ? <Table
                    columns={columns}
                    dataSource={null}
                    style={{ overflow: 'visible', width: '100%', fontSize: '16px' }}
                    scroll={{
                        y: 400,
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
                                disabled: i === 28,
                                children:
                                    <Table
                                        columns={columns}
                                        dataSource={getFilteredDataByYear(year)}
                                        style={{ overflow: 'visible', width: '100%', fontSize: '16px' }}
                                        scroll={{
                                            y: 300,
                                        }}
                                        pagination={{
                                            pageSize: 5
                                        }}
                                    ></Table>
                            };
                        })}
                    />
                }
            </div>
            <Drawer
                title="Manager Feedback"
                width={520}
                styles={{
                    body: {
                        paddingBottom: 80,
                    }
                }}
                placement={'right'}
                closable={false}
                onClose={onClose}
                open={openDrawer}
                key={'right'}
            >
                <div className='mt-4'>
                    <Form
                        form={form}
                        name="employee-feedback"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Card title={`Selected Goal: ${selectedGoal}`} style={{ marginBottom: '20px' }}>
                            <Form.Item
                                name="rating"
                                label="Rating"
                                rules={[{ required: true, message: 'Please provide a rating!' }]}
                            >
                                <Rate />
                            </Form.Item>
                            <Form.Item
                                name="comment"
                                label="Comment"
                                rules={[{ required: true, message: 'Please provide a comment!' }]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Card>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div >
            </Drawer >
            <Drawer
                title="Manager Feedback Data"
                width={520}
                styles={{
                    body: {
                        paddingBottom: 80,
                    }
                }}
                placement={"right"}
                closable={false}
                onClose={onViewClose}
                open={openViewDrawer}
            >
                <div>
                    <div className="col"><h6>Name</h6>{viewGoalData?.goalName}</div><hr></hr>
                    <div className='row'>
                        <div className="col"><h6>Type</h6>{viewGoalData?.goalType}</div>
                        <div className='col'><h6>Status</h6><Tag color="magenta">{(viewGoalData?.goalStatus == "IN_PROGRESS") ? 'IN PROGRESS' : viewGoalData?.goalStatus}</Tag></div>
                    </div>
                    <hr></hr>
                    <div className='row'>
                        <div className="col"><h6>Creation date</h6>
                            {<>
                                <span className="text-success">
                                    {moment(viewGoalData?.setDate).format('YYYY-MM-DD')}
                                </span>
                                <span className='text-success ms-3'>
                                    {moment(viewGoalData?.setDate).format('hh:mm A')}
                                </span>
                            </>
                            }
                        </div>
                        <div className="col"><h6>End date</h6>
                            {viewGoalData?.endDate && <>
                                <span className="text-danger">
                                    {moment(viewGoalData?.endDate).format('YYYY-MM-DD')}
                                </span>
                                <span className='text-danger ms-3'>
                                    {moment(viewGoalData?.endDate).format('hh:mm A')}
                                </span>
                            </>
                            }
                        </div>
                    </div>
                    <hr></hr>
                    <div className='row'>
                        <div className="col"><h6>Rating</h6><Rate disabled defaultValue={viewGoalData?.managerRating} /></div>
                        <div className='col'><h6>Comment</h6>{viewGoalData?.managerComments}</div>
                    </div>
                    <hr></hr>
                    <div className='row'>
                        <div className="col"><h6>Description</h6>{viewGoalData.description}</div>
                    </div>
                    <hr></hr>
                    <div className='row'>
                        <div className="col"><h6>Measurable</h6>{viewGoalData.measurable}</div>
                    </div>
                    <hr></hr>
                    {/* <div>
                    <Space size="middle">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(viewGoalData)}
                        >
                            Edit
                        </Button>
                        <Popconfirm
                            title="Are you sure to delete this goal?"
                            onConfirm={() => handleDelete(viewGoalData.goalId)}
                            okText="Yes"

                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'red  ' }} />}
                        >
                            <Button
                                // type="danger"
                                className='btn btn-dark'
                                icon={<DeleteOutlined />}
                            >Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                </div> */}
                </div>
                {/* <Descriptions column={1} bordered>
                <Descriptions.Item label="Name">{viewGoalData.name}</Descriptions.Item>
                <Descriptions.Item label="Type">{viewGoalData.type}</Descriptions.Item>
                <Descriptions.Item label="Description">{viewGoalData.description}</Descriptions.Item>
                <Descriptions.Item label="Measurable">{viewGoalData.measurable}</Descriptions.Item>
                <Descriptions.Item label="Creation Date">{viewGoalData.createdDate}</Descriptions.Item>
                <Descriptions.Item label="End Date">{viewGoalData.endDate}</Descriptions.Item>
                <Descriptions.Item label="Status">{viewGoalData.status}</Descriptions.Item>
            </Descriptions> */}
            </Drawer>
        </>
    )
}

export default EmployeeManagerFeedback