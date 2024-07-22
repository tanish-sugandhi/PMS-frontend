import React, { useEffect, useState } from 'react';
import { Rate, Table, Drawer, Tag, Tabs } from 'antd';
import '../../styles/feedback.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import { getUserGoals } from '../../services/GoalService';

const EmployeeSelfFeedback = (props) => {
    const employeeRecord = props.data;
    const navigate = useNavigate();
    const [goalData, setGoalData] = useState([]);
    const [data, setData] = useState([]);
    const [openViewDrawer, setOpenViewDrawer] = useState(false);
    const [viewGoalData, setViewGoalData] = useState({});
    const [yearlyRecord, setYearlyRecord] = useState([]);

    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            width: 30
        },
        {
            title: 'Goal Title',
            dataIndex: 'goalName',
            key: 'goalName',
            width: 100,
            ellipsis: true,
        },
        {
            title: 'Rating',
            dataIndex: 'selfRating',
            key: 'selfRating',
            width: 100,
            render: (_, record) => (
                record?.selfRating && record?.selfRating && <Rate disabled defaultValue={record.selfRating} />
            ),
        },
        {
            title: 'Comment',
            dataIndex: 'selfComments',
            key: 'selfComments',
            width: 150,
            ellipsis: true
        },
        {
            title: 'Date Added',
            dataIndex: 'selfFeedbackDate',
            key: 'selfFeedbackDate',
            width: 80,
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
            )
        },
    ];

    const fetchData = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"))?.token;
            const userId = employeeRecord?.userId;
            const response = await getUserGoals(token, userId).then(res => res.sort((a, b) => a?.selfRating - b?.selfRating))
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
            console.error("Error fetching user seld feedback:", error);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    //list goals
    const fetchGoals = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"))?.token;
            const userId = JSON.parse(localStorage.getItem("token"))?.userId;
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const data = await getUserGoals(token, (userId) ? userId : currentUser?.userId);
            // console.log(data);
            setGoalData(data?.filter(item => (item?.selfRating == null)));
        } catch (error) {
            console.error("Error fetching user goals:", error);
        }
    }
    useEffect(() => { fetchGoals() }, []);

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
                <div className='mt-2'>
                    {data?.length === 0 ?
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
                                            onRow={(record) => {
                                                return {
                                                    onClick: () => viewGoal(record),
                                                };
                                            }}
                                        ></Table>
                                };
                            })}
                        />
                    }
                </div>
                <Drawer
                    title="Self Feedback"
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
                                {<>
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
                            <div className="col"><h6>Rating</h6>
                                <Rate disabled defaultValue={viewGoalData && viewGoalData?.selfRating} />
                            </div>
                            <div className='col'><h6>Date Rated</h6>
                                {
                                    viewGoalData?.selfFeedbackDate &&
                                    <>
                                        <span className="">
                                            {moment(viewGoalData?.selfFeedbackDate).format('YYYY-MM-DD')}
                                        </span>
                                        <span className='ms-3'>
                                            {moment(viewGoalData?.selfFeedbackDate).format('hh:mm A')}
                                        </span>
                                    </>
                                }
                            </div>
                        </div>
                        <hr></hr>
                        <div className='row'>
                            <div className='col'><h6>Comment</h6>{viewGoalData?.selfComments}</div>
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
                    </div>
                </Drawer>
            </div>
        </>
    )
}

export default EmployeeSelfFeedback;