import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Drawer, Form, InputNumber, Input, Select, Rate, Segmented, Table, message, Tabs } from 'antd';
import { LeftOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import '../../styles/feedback.css';
import { useNavigate } from 'react-router-dom';
import { getUserFeedback } from '../../services/FeedbackService';
import getUserById from '../../services/UserService';
import moment from 'moment/moment';
import { getUserGoals } from '../../services/GoalService';
import axios from 'axios';
import StageTimeLineService from '../../services/StageTimeLineService';

const { TextArea } = Input;
const { Option } = Select;

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const token = JSON.parse(localStorage.getItem("token"))?.token;
const SelfFeedback = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [goalData, setGoalData] = useState([]);
    const [data, setData] = useState([]);
    const [activeTimelines, setActiveTimelines] = useState(null);
    const [showSelfFeedbackButton, setSelfShowFeedbackButton] = useState(false);
    // const [value, setValue] = useState('Map');
    // const [rating, setRating] = useState(0)
    //To find all years from the goals
    const [yearlyRecord, setYearlyRecord] = useState([]);

    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onClose = () => {
        setOpenDrawer(false);
    };
    const fetchTimelinesByDate = async () => {
        const currentDateTime = new Date().toISOString().slice(0, 19); // Format to 'yyyy-MM-ddTHH:mm:ss'
        try {
            const timelines = await StageTimeLineService.getTimelinesByDate(currentDateTime);
            console.log('Fetched Timelines:', timelines);

            const hasSelfFeedbackTimeline = timelines.some(timeline => timeline.stageName === 'SELF_FEEDBACK');
            setSelfShowFeedbackButton(hasSelfFeedbackTimeline); // Update state based on condition
        } catch (error) {
            console.error('Error fetching timelines:', error);
        }
    };
    useEffect(() => {
        fetchTimelinesByDate();
    }, []);
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
            dataIndex: 'selfRating',
            key: 'selfRating',
            width: 100,
            render: (_, record) => (
                <Rate disabled defaultValue={record.selfRating} />
            ),
            sorter: (a, b) => a.rating - b.rating
        },
        {
            title: 'Comment',
            dataIndex: 'selfComments',
            key: 'selfComments',
            width: 210,
            ellipsis: true,
            // render: (_, record) => (
            //     <>
            //         <Button >View More</Button>
            //     </>
            // ),
        },
        {
            title: 'Date Added',
            dataIndex: 'selfFeedbackDate',
            key: 'selfFeedbackDate',
            width: 110,
            render: (_, record) => (
                record?.selfFeedbackDate &&
                <>
                    <span className="">
                        {moment(record?.selfFeedbackDate).format('YYYY-MM-DD')}
                    </span>
                    <span className='ms-3'>
                        {moment(record?.selfFeedbackDate).format('hh:mm A')}
                    </span>
                </>
            ),
            sorter: (a, b) => moment(a.selfFeedbackDate).unix() - moment(b.selfFeedbackDate).unix(),
        },

    ];

    const fetchData = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"))?.token;
            const userId = JSON.parse(localStorage.getItem("token"))?.userId;
            const response = await getUserGoals(token, userId).then(res => res?.filter(item => item.selfRating != null))
            // console.log(response);
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
        fetchData();
    }, [])
    console.log(yearlyRecord);
    //list goals
    const fetchGoals = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"))?.token;
            const userId = JSON.parse(localStorage.getItem("token"))?.userId;
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const data = await getUserGoals(token, (userId) ? userId : currentUser?.userId);
            console.log(data);
            setGoalData(data?.filter(item => (item?.selfRating == null)));
        } catch (error) {
            console.error("Error fetching user goals:", error);
        }
    }
    useEffect(() => { fetchGoals() }, []);

    const onFinish = async (values) => {
        const token = JSON.parse(localStorage.getItem("token"))?.token;
        // console.log(values  );
        const finalGoalData = goalData?.filter(item => item?.goalName == selectedGoal);
        const response = await axios.put(`http://localhost:8080/api/goals/selfFeedback/${finalGoalData[0]?.goalId}`,
            {
                'selfRating': values.rating,
                'selfComments': values.comment
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
        fetchGoals();
        form.resetFields();
        setOpenDrawer(false);

        // console.log('Received values of form:', values);
    };
    const [selectedGoal, setSelectedGoal] = useState(null);
    const handleGoalChange = (value) => {
        setSelectedGoal(value);
    };
    useEffect(() => {
        fetchTimelinesByDate();
    }, []);
    const getFilteredDataByYear = (year) => {
        return data?.filter(item => item.year == year).map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }))
    }
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>Self Feedback</h3>
                {showSelfFeedbackButton && (
                    <Button type="primary" onClick={showDrawer}>
                        {/* <PlusOutlined />  */}
                        <i className="fa-solid fa-plus me-2" style={{ fontSize: '13px' }}></i>Add Feedback
                    </Button>
                )}
            </div>
            <div className=' mt-2'>
                <Button className='btn-primary' onClick={() => navigate('/feedback')}>
                    <LeftOutlined />
                </Button>
                <div className='mt-2'>
                    {data?.length == 0 ?
                        <Table
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
                                                y: 400,
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
            </div>
            <Drawer
                title="Feedback"
                placement={"right"}
                closable={false}
                onClose={onClose}
                open={openDrawer}
            >
                <Form
                    form={form}
                    name="employee-feedback"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="goal"
                        label="Select Goal"
                        rules={[{ required: true, message: 'Please select a goal!' }]}
                    >
                        {/* <Select placeholder="Select a goal" onChange={handleGoalChange}>
                            {goalData?.map((goal, index) => (
                                <Option key={index} value={goal.goalName}>{goal.goalName}</Option>
                            ))}
                        </Select> */}
                        {goalData && goalData?.length > 0 ? (
                            <Select placeholder="Select a goal" onChange={handleGoalChange}>
                                {goalData.map((goal, index) => (
                                    <Option key={index} value={goal.goalName}>{goal.goalName}</Option>
                                ))}
                            </Select>
                        ) : (
                            <p>No goals available</p> // Message when no goals are available
                        )}
                    </Form.Item>
                    {selectedGoal && (
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
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

export default SelfFeedback;