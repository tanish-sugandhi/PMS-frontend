import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Space, DatePicker, message, TimePicker } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import moment from 'moment';
import dayjs from 'dayjs';
import { saveOrganisationalGoal, savePersonalGoal } from '../../../services/GoalService';

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
};

const AddEmpGoals = ({ data, onClose, onGoalAdded }) => {
    // const AddEmpGoals = (props)=>{
    // const onClose = props.onClose;
    // const onGoalAdded = props.onGoalAdded; 
    const [formValues, setFormValues] = useState();
    // console.log(data);
    const [initialData, setInitialData] = useState({
        'goalName': '',
        'goalType': '',
        'description': '',
        'measurable': '',
        'endDate': '',
        'goalStatus': ''
    });
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});

    const [form] = Form.useForm();
    const [dateForm] = Form.useForm();

    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);

    const objDate = Date.now();
    const dateFormat = 'YYYY-MM-DD';
    const currentDate = dayjs(objDate).format(dateFormat);
    const [currentTimeline, setCurrentTimeline] = useState(null);

    const getTimeline = () => {
        
    }
    const getCurrentUser = () => { setCurrentUser(JSON.parse(localStorage.getItem("currentUser"))) };

    useEffect(() => {
        getCurrentUser();
    }, [])

    const validateName = (_, value) => {
        if (!value) {
            return Promise.reject('Please enter the goal name');
        }
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
            return Promise.reject('Name can only contain letters and spaces');
        }
        return Promise.resolve();
    };

    const validateDescription = (_, value) => {

        // if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        //   return Promise.reject('Name can only contain letters, numbers and spaces');
        // }
        // if (value.length < 5) {
        //   return Promise.reject('Description must be at least 5 characters');
        // }
        return Promise.resolve();
    };

    const validateMeasurable = (_, value) => {

        // if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        //   return Promise.reject('Name can only contain letters, numbers and spaces');
        // }
        return Promise.resolve();
    };

    const onFinish = (values) => {
        const token = JSON.parse(localStorage.getItem("token"))?.token;
        const managerData = JSON.parse(localStorage.getItem("token")).currentUser;
        if (date && time) {
            const dateTime = moment(date.format('YYYY-MM-DD') + ' ' + time.format('HH:mm:ss')).format('YYYY-MM-DDTHH:mm:ss');
            values.endDate = dateTime;
        }
        try {
            const result = saveOrganisationalGoal( values, data.userId, currentUser.userId);
            setFormValues(result);
            message.success('Data saved successfully');
            setInitialData({
                'goalName': '',
                'goalType': '',
                'description': '',
                'measurable': '',
                'endDate': '',
                'goalStatus': ''
            });
            onGoalAdded();
            onClose();
        }
        catch {
            message.error('Data Can\'t be saved at present! Internal Server Error')
        }
    form.resetFields();
    onGoalAdded();
    onClose();
};
const onReset = () => {
    form.resetFields();
};

return (
    <>
        <Form
            form={form}
            name="control"
            onFinish={onFinish}
            {...formItemLayout}
            variant="filled"
            style={{
                maxWidth: 600,
            }}
        >
            <Form.Item
                label="Name"
                name="goalName"
                rules={[{ required: true, message: 'Please enter the goal name' },
                { min: 5, message: 'Goal must be at least 5 characters long' }
                ]}
            >
                <Input placeholder="Enter goal name" value={initialData.goalName} />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter the goal description' }, { validator: validateDescription },

                ]}
            >
                <Input.TextArea placeholder="Enter goal description" value={initialData.description} />
            </Form.Item>

            <Form.Item
                label="Type"
                name="goalType"
                rules={[{ required: true, message: 'Please select the goal type' }]}
            >
                <Select placeholder="Select goal type" value={initialData.goalType}>
                    <Option value="PERSONAL" disabled>PERSONAL</Option>
                    <Option value="ORGANISATIONAL">ORGANISATIONAL</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Measurable"
                name="measurable"
            >
                <Input.TextArea placeholder="Enter goal Measurable" value={initialData.measurable} />
            </Form.Item>

            <Form.Item
                label="End Date"
                name="endDate"
            >
                <DatePicker
                    value={initialData.endDate}
                    showTime
                    placeholder='optional'
                    minDate={dayjs(currentDate, dateFormat)}
                    maxDate={dayjs('2024-12-31', dateFormat)}
                />

            </Form.Item>
            {/* <Form.Item
          label="Status"
          name="goalStatus"
          rules={[{ required: true, message: 'Please mention the goal status' }]}
        >
          <Select title='Status' value={initialData.goalStatus}>
            <Select.Option value="CREATED">CREATED</Select.Option>
            <Select.Option value="APPROVED">APPROVED</Select.Option>
            <Select.Option value="IN_PROGRESS">IN_PROGRESS</Select.Option>
            <Select.Option value="COMPLETED">COMPLETED</Select.Option>
          </Select>
        </Form.Item> */}
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    </>
)
}

export default AddEmpGoals