import React, { useEffect, useState } from 'react';
import { Button, Rate, Segmented, Table, Tabs } from 'antd';
import { LeftOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import '../../styles/feedback.css';
import { useNavigate } from 'react-router-dom';
import { getUserFeedback } from '../../services/FeedbackService';
import getUserById from '../../services/UserService';
import moment from 'moment/moment';

const token = JSON.parse(localStorage.getItem("token"))?.token;
const PeerFeedback = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [value, setValue] = useState('Map');
    const [rating, setRating] = useState(0);
    //To find all years from the goals
    const [yearlyRecord, setYearlyRecord] = useState([]);
    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            width: 50
        },
        {
            title: 'Provider',
            dataIndex: 'providerName',
            key: 'providerName',
            width: 100
        },
        {
            title: 'Comment',
            dataIndex: 'comments',
            key: 'comments',
            width: 300,
            ellipsis: true,
            // render: (_, record) => (
            //     <>
            //         <Button >View More</Button>
            //     </>
            // ),
        },
        {
            title: 'Date Added',
            dataIndex: 'feedbackDate',
            key: 'feedbackDate',
            width: 110,
            render: (_, record) => (
                <>
                    <span className="">
                        {moment(record?.feedbackDate).format('YYYY-MM-DD')}
                    </span>
                    <span className='ms-3'>
                        {moment(record?.feedbackDate).format('hh:mm A')}
                    </span>
                </>
            ),
            sorter: (a, b) => moment(a.feedbackDate).unix() - moment(b.feedbackDate).unix(),
        },

    ];

    const fetchData = async () => {
        const userId = JSON.parse(localStorage.getItem("token"))?.userId;
        const token = JSON.parse(localStorage.getItem("token"))?.token;
        try {
            const response = await getUserFeedback(token, userId).then(res => res?.filter(item => item.feedbackType == 'FEEDBACK_360'))
            .then(data=> data)
            .catch(err=>{
                console.log(err);
                setData([]);
            })
            setData(response?.map((item, index) => ({
                ...item,
                // serialNumber: index + 1,
                year: new Date(item?.feedbackDate).getFullYear()
            })));
            const years = response?.map(item => new Date(item?.feedbackDate).getFullYear());
            const uniqueYearsSet = new Set(years);
            setYearlyRecord(Array.from(uniqueYearsSet));
        } catch (error) {
            console.error("Error fetching user feedback:", error);
        }
    }
    console.log(yearlyRecord);
    useEffect(() => {
        fetchData();
    }, [])
    // console.log("Feedback response data : " + data);
    const getFilteredDataByYear = (year) => {
        return data?.filter(item => item.year == year).map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
    }
    return (
        <>
            <div>
                <h3>Peer Feedback</h3>
            </div>
            <div className='mt-4'>
                <Button className='btn-primary' onClick={() => navigate('/feedback')}>
                    <LeftOutlined />
                </Button>
                <div className='mt-2'>
                    {(data?.length == 0 || typeof data === 'undefined') ?
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
        </>
    )
}

export default PeerFeedback
