import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Rate, Table, Tabs } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import '../../styles/feedback.css';
import { useNavigate } from 'react-router-dom';
import { getUserGoals } from '../../services/GoalService';
import moment from 'moment';

// const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// const token = JSON.parse(localStorage.getItem("token"))?.token;
const ManagerFeedback = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    //To find all years from the goals
    const [yearlyRecord, setYearlyRecord] = useState([]);
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
            width: 100,
            render: (_, record) => (
                record && record?.managerRating &&
                <Rate disabled defaultValue={record.managerRating} />
            ),
        },
        {
            title: 'Comment',
            dataIndex: 'managerComments',
            key: 'managerComments',
            width: 210,
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
            ),
            sorter: (a, b) => moment(a.managerFeedbackDate).unix() - moment(b.managerFeedbackDate).unix(),
        },

    ];

    const fetchData = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"))?.token;
            const userId = JSON.parse(localStorage.getItem("token"))?.userId;
            const response = await getUserGoals(token, userId).then(res => res)
            console.log("manager feedback", response);
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
        console.log("hello folks");
        fetchData();
    }, [])
    const getFilteredDataByYear = (year) => {
        return data?.filter(item => item.year == year).map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
    }
    return (
        <>
            <div className='h-100'>
                <div>
                    <h3>Manager Feedback</h3>
                </div>
                <Button className='btn-primary mt-4 ' onClick={() => navigate('/feedback')}>
                    <LeftOutlined />
                </Button>
                <div className='mt-2'>
                    {data?.length == 0 ? <Table
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
                                            style={{ overflow: 'visible', width: '100%', fontSize: '16px' }}
                                            scroll={{
                                                y: 350,
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
                <div style={{height:'10px'}}></div>
            </div>
        </>
    )
}

export default ManagerFeedback