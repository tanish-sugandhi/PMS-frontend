import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { updateGoalService } from '../../../services/GoalService';

const { Option } = Select;
const token = JSON.parse(localStorage.getItem("token"))?.token;

const UpdateGoals = ({ values, onClose, onGoalupdated }) => {
    const [form] = Form.useForm();
    const [existingData, setExistingData] = useState(values);
    const objDate = values.endDate;
    const dateFormat = 'YYYY-MM-DD';
    const currentDate = dayjs(objDate).format(dateFormat);

    useEffect(() => {
        form.setFieldsValue({
            goalName: existingData.goalName,
            description: existingData.description,
            goalType: existingData.goalType,
            measurable: existingData.measurable,
            goalStatus: existingData.goalStatus
        });
    }, [existingData, form, values]);

    useEffect(() => {
        setExistingData(values);
    }, [values]);

    const validateName = (_, value) => {
        const trimmedValue = value.trim(); 
        return Promise.resolve();
    };

    const onFinish = async (goal) => {
        try {
            const response = await updateGoalService(token, values, goal);
            console.log(response); // Log the response if needed
            if(response != null){
                message.success('Goal updated successfully');
                onGoalupdated(); // Notify parent component about successful update
                onClose(); // Close the modal
            }
            else{
                message.error('Failed to update goal');
            }
        } catch (error) {
            console.error('Error updating goal:', error);
        }
        onGoalupdated();
        form.resetFields();    
    };

    const handleCancel = () => {
        form.resetFields();
        onClose(); // Close the modal without saving changes
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="goalName"
                    label="Goal Name"
                    initialValue={existingData.goalName}
                    rules={[{ required: true, message: 'Please enter the goal name' },
                        { validator: validateName }
                    ]}
                >
                    <Input placeholder="Enter goal name" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    initialValue={existingData.description}
                    rules={[{ required: true, message: 'Please enter the goal description' }]}
                >
                    <Input.TextArea placeholder="Enter goal description" />
                </Form.Item>
                <Form.Item
                    name="goalType"
                    label="Goal Type"
                    initialValue={existingData.goalType}
                    rules={[{ required: true, message: 'Please select the goal type' }]}
                >
                    <Select placeholder="Select goal type">
                        <Option value="PERSONAL">PERSONAL</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="measurable"
                    label="Measurable"
                    initialValue={existingData.measurable}
                >
                    <Input.TextArea placeholder="Enter goal Measurable" />
                </Form.Item>
                <Form.Item
          label="End Date"
          name="endDate"
        > 
          <DatePicker defaultValue={dayjs(existingData.endDate, dateFormat)}
            showTime
            placeholder='optional'
            minDate={dayjs(currentDate, dateFormat)}
            maxDate={dayjs('2024-12-31', dateFormat)}
          />
        </Form.Item>
                <Form.Item
                    name="goalStatus"
                    label="Goal Status"
                    initialValue={(existingData.goalStatus === 'IN_PROGRESS')?"IN PROGRESS":existingData.goalStatus}
                >
                    <Select>
                        <Option disabled value="CREATED">CREATED</Option>
                        <Option value="APPROVED">APPROVED</Option>
                        <Option value="IN_PROGRESS">IN PROGRESS</Option>
                        <Option value="COMPLETED">COMPLETED</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Goal
                    </Button>
                    <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default UpdateGoals;
