import { ConfigProvider,Segmented } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import EmployeeSelfFeedback from './EmployeeSelfFeedback';
import EmployeeManagerFeedback from './EmployeeManagerFeedback';
import EmployeePeerFeedback from './EmployeePeerFeedback';

const EmployeeFeedback = (props) => {
    const employeeRecord = props.data;
    const [goalData, setGoalData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('self');
    const navigate = useNavigate();

    const handleSegmentChange = (value) => {
        setSelectedOption(value);
    };

    return (
        <div>
            <ConfigProvider
                theme={{
                    components: {
                        Segmented: {
                            trackBg: '#91d5ff'
                        },
                    },
                }}
            >
                <div className='mt-0'>
                    <Segmented
                        block
                        className='bg-primary text-white'
                        size='middle'
                        options={[
                            {
                                label: (
                                    <div style={{ padding: 1 }}>
                                        <div>Self Feedback</div>
                                    </div>
                                ),
                                value: 'self',
                            },
                            {
                                label: (
                                    <div style={{ padding: 1 }}>
                                        <div>Manager Feedback</div>
                                    </div>
                                ),
                                value: 'manager',
                            },
                            {
                                label: (
                                    <div style={{ padding: 1 }}>
                                        <div>Peer Feedback</div>
                                    </div>
                                ),
                                value: 'peer',
                            }
                        ]}
                        onChange={handleSegmentChange}
                        value={selectedOption}
                    />
                    <div className='mt-0'>
                        {selectedOption === 'self' ? <EmployeeSelfFeedback data={employeeRecord} /> : selectedOption === 'manager' ?
                            <EmployeeManagerFeedback data={employeeRecord} /> :
                            <EmployeePeerFeedback data={employeeRecord} />}
                    </div>
                </div>
            </ConfigProvider>
        </div>
    );
}

export default EmployeeFeedback