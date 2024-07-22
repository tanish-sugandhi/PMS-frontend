import { Button, Drawer, Popconfirm, Space, Table, Tabs, Tag, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { deleteGoal, getUserGoals } from '../../services/GoalService';

import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddGoals from './AddGoals';
import StageTimeLineService from '../../services/StageTimeLineService';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import UpdateEmpGoals from '../manager/empGoals/UpdateEmpGoals';

const DisplayGoals = () => {

    const token = JSON.parse(localStorage.getItem("token"))?.token;
    const reduxToken = useSelector(state => state.token.value);
    // console.log("Token slice : " + reduxToken);
    const navigate = useNavigate();

    const [goalData, setGoalData] = useState([]);
    const [existingGoal, setExistingGoal] = useState(null);
    const [page, setPage] = React.useState(1);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openUpdateDrawer, setOpenUpdateDrawer] = useState(false);
    const [placement, setPlacement] = useState('right');
    const [openViewDrawer, setOpenViewDrawer] = useState(false);
    const [viewGoalData, setViewGoalData] = useState({});
    const [activeTimelines, setActiveTimelines] = useState(null);
    const [timelineCycleData, setTimelineCycleData] = useState([]);

    const date = new Date();
    const currentDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
    //To find all years from the goals
    const [yearlyRecord, setYearlyRecord] = useState([]);

    // console.log("goalData :", goalData);
    if (goalData == undefined) {
        // navigate('/');
    }
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const fetch = async () => {
        const token = JSON.parse(localStorage.getItem("token"))?.token;
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        try {
            const data = await getUserGoals(token, currentUser.userId);
            let s = 1;
            setGoalData(data?.map((item, index) => ({
                ...item,
                // serialNumber: index + 1,
                year: new Date(item?.setDate).getFullYear()
            })));
            const years = data?.map(item => new Date(item?.setDate).getFullYear());
            const uniqueYearsSet = new Set(years);
            setYearlyRecord(Array.from(uniqueYearsSet));
        } catch (error) {
            console.error("Error fetching user goals:", error);
        }
    }
    // console.log("goal years data :"+yearlyRecord);
    const getTagColor = (status) => {
        switch (status) {
            case 'CREATED':
                return 'magenta';
            case 'APPROVED':
                return 'red';
            case 'IN_PROGRESS':
                return 'gold';
            default:
                return 'green';
        }
    };

    // useCallback(() => { fetch() }, [fetch, goalData])
    useCallback(() => { fetch() }, [fetch, goalData])
    useEffect(() => { fetch() }, []);


    //drawer actions
    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onClose = () => {
        fetch();
        setOpenDrawer(false);
    };
    const handleEdit = (record) => {
        setExistingGoal(record);
        setOpenUpdateDrawer(true);
    };
    const onUpdateClose = () => {
        setOpenUpdateDrawer(false);
    };

    const handleDelete = async (goalId) => {
        try {
            await deleteGoal(token, goalId);
            message.success('Goal deleted successfully');
            fetch();
        } catch (error) {
            message.error('Failed to delete goal');
            console.error("Error deleting goal:", error);
        }
    };
    const viewGoal = (values) => {
        console.log(values);
        setViewGoalData(values);
        setOpenViewDrawer(true);
    }
    const onViewClose = () => {
        setOpenViewDrawer(false);
    };
    // Function to fetch timelines by date and print to console
    const fetchTimelinesByDate = async () => {
        const currentDateTime = new Date().toISOString().slice(0, 19); // Format to 'yyyy-MM-ddTHH:mm:ss'
        try {
            const timelines = await StageTimeLineService.getTimelinesByDate(currentDateTime);
            // Check if there is a timeline with StageName === 'GOAL_SETTING'
            const hasGoalSettingTimeline = timelines.some(timeline => timeline.stageName === 'GOAL_SETTING');
            setActiveTimelines(hasGoalSettingTimeline); // Update state based on condition
        } catch (error) {
            console.error('Error fetching timelines:', error);
        }
    };
    useEffect(() => {
        fetchTimelinesByDate();
        fetchTimelineCycleData();
    }, []);

    const fetchTimelineCycleData = async()=>{
        // console.log("setting timelineCycleData");
        const result = await StageTimeLineService.getTimelineCycleData();
        setTimelineCycleData(result);
    }
    // console.log("TimelineCycleData ",timelineCycleData);
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
            render: (name) => `${name}`,
            width: 150,
            ellipsis:true
        },
        {
            title: 'Goal Type',
            dataIndex: 'goalType',
            key: 'goalStatus',
            width: 110,
        },
        {
            title: 'Goal Status',
            dataIndex: 'goalStatus',
            key: 'goalStatus',
            width: 110,
            render: (_, record) => (
                <Tag color={getTagColor(record?.goalStatus)}>{record?.goalStatus}</Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 110,
            render: (_, record) => (
                <>
                    <Button onClick={() => viewGoal(record)}>details</Button>
                </>
            ),
        },
    ];
    const getFilteredDataByYear = (year) => {
        let fetchTimelineCycleData = timelineCycleData?.filter(cycle=>new Date(cycle?.startDate).getFullYear() == year);
        return goalData?.filter(goal => goal.PerformanceCycleId == fetchTimelineCycleData?.timelineCycleId).map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
    }
    
    // console.log(getFilteredDataByYear(2024));
    return <div className='m-3 mt-4'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <h2>Goals</h2>
            {
                activeTimelines &&
                <Button type="primary" onClick={showDrawer}>
                    {/* <PlusOutlined />  */}
                    <i className="fa-solid fa-plus me-2" style={{ fontSize: '13px' }}></i>New Goal
                </Button>
            }
        </div>
        {/* <div className="m-2"> */}
        <div className='mt-2'>
            {goalData?.length == 0 ? <Table
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
                                        current: page,
                                        pageSize: 5,
                                        onChange(current) {
                                            setPage(current);
                                        }
                                    }}
                                ></Table>,
                        };
                    })}
                />
            }
        </div>

        <Drawer
            title="Goal Data"
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
                    <div className="col"><h6>Description</h6>{viewGoalData.description}</div>
                </div>
                <hr></hr>
                <div className='row'>
                    <div className="col"><h6>Measurable</h6>{viewGoalData.measurable}</div>
                </div>
                <hr></hr>
                {
                    viewGoalData.goalType == 'PERSONAL' &&
                    <div>
                        <Space size="middle">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(viewGoalData)}
                            >
                            </Button>
                            <Popconfirm
                                title="Are you sure to delete this goal?"
                                onConfirm={() => handleDelete(viewGoalData.goalId)}
                                okText="Yes"

                                cancelText="No"
                                icon={<QuestionCircleOutlined style={{ color: 'red  ' }} />}
                            >
                                <Button
                                    className='btn btn-dark'
                                    icon={<DeleteOutlined />}
                                >
                                </Button>
                            </Popconfirm>
                        </Space>
                    </div>
                }
            </div>
        </Drawer>
        <Drawer
            title="New Goal"
            placement={placement}
            closable={false}
            onClose={onClose}
            open={openDrawer}

        >
            <AddGoals onClose={onClose} onGoalAdded={fetch} />
        </Drawer>
        <Drawer
            title="Update Goal"
            placement={placement}
            closable={false}
            onClose={onUpdateClose}
            open={openUpdateDrawer}
            key={placement}
            width={520}
        >
            <UpdateEmpGoals values={existingGoal} onClose={onUpdateClose} onGoalupdated={fetch} />
        </Drawer>
    </div>
}
export default DisplayGoals;