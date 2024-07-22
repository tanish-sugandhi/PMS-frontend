

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  DatePicker,
  Form,
  Select,
  message,
  Spin
} from 'antd';
import { useDispatch } from "react-redux";
const token = JSON.parse(localStorage.getItem("token"));
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const AddTrackingData = ({ employeeAdd, onClose, onGoalAdded }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [form] = Form.useForm();
  const [progressTrackingData, setProgressTrackingData] = useState({
    year: '',
    month: '',
    title: '',
    notes: null,
    recording: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleTitle = (e) => {
    setProgressTrackingData({ ...progressTrackingData, title: e.target.value });
  };

  const handleYear = (year, yearString) => {
    setProgressTrackingData({ ...progressTrackingData, year: yearString });
  };

  const handleMonth = (e) => {
    setProgressTrackingData({ ...progressTrackingData, month: e });
  };

  const handleNotesChange = (e) => {
    setProgressTrackingData({ ...progressTrackingData, notes: e.target.files[0] });
  };

  const handleRecordingChange = (e) => {
    setProgressTrackingData({ ...progressTrackingData, recording: e.target.files[0] });
  };

  const addData = async () => {
    setLoading(true); // Start loading
    try {
      let trackingData = new FormData();
      trackingData.append('title', progressTrackingData.title);
      trackingData.append('month', progressTrackingData.month);
      trackingData.append('year', progressTrackingData.year);
      trackingData.append('notes', progressTrackingData.notes);
      trackingData.append('recording', progressTrackingData.recording);

      await axios.post(
        `http://localhost:8080/api/progress/addNotes/${employeeAdd.key}`,
        trackingData,
        {
          headers: {
            Authorization: `Bearer ${token?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      ).then(
        (response) => {
          setIsSubmitted(true);
          const res = typeof response.data;
          if (res === "string") {
            message.warning('Data of month and year is already present');
          } else {
            message.success('Data saved successfully');
            form.resetFields();
            setProgressTrackingData({
              title: '',
              month: '',
              year: '',
              notes: null,
              recording: null,
            });
            onGoalAdded();
            onClose();
          }
        },
        (error) => {
          setProgressTrackingData({
            title: '',
            month: '',
            year: '',
            notes: null,
            recording: null,
          });
          message.error('Failed to add data');
        }
      );
    } catch (error) {
      console.error(error);
      setProgressTrackingData({
        title: '',
        month: '',
        year: '',
        notes: null,
        recording: null,
      });
      message.error('Failed to add data');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const resetData = () => {
    onClose();
    form.resetFields();
    setProgressTrackingData({
      title: '',
      month: '',
      year: '',
      notes: null,
      recording: null,
    });
  }

  useEffect(() => {
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  }, [isSubmitted]);

  return (
    <Spin spinning={loading}> {/* Wrap the form with Spin */}
      <Form
        form={form}
        {...formItemLayout}
        style={{ maxWidth: 600 }}
        onFinish={addData}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: 'Please input!' }
          ]}
        >
          <input type="text" placeholder="Enter title" name="description" className='form-control' onChange={handleTitle} required />
        </Form.Item>

        <Form.Item
          label="Month"
          name="month"
          rules={[
            { required: true, message: 'Please input!' }
          ]}
        >
          <Select
            placeholder="Select month"
            style={{ width: 120 }}
            onChange={handleMonth}
            options={[
              { value: 'January', label: 'January' },
              { value: 'February', label: 'February' },
              { value: 'March', label: 'March' },
              { value: 'April', label: 'April' },
              { value: 'May', label: 'May' },
              { value: 'June', label: 'June' },
              { value: 'July', label: 'July' },
              { value: 'August', label: 'August' },
              { value: 'September', label: 'September' },
              { value: 'October', label: 'October' },
              { value: 'November', label: 'November' },
              { value: 'December', label: 'December' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Year"
          name="year"
          rules={[
            { required: true, message: 'Please input!' }
          ]}
        >
          <DatePicker onChange={handleYear} style={{ width: "100%" }} picker="year" required />
        </Form.Item>

        <Form.Item
          label="Notes"
          name="notes"
          rules={[
            { required: true, message: 'Please input!' }
          ]}
        >
          <input type="file" placeholder="Enter meeting notes" name="notes" className='form-control' onChange={handleNotesChange} required />
        </Form.Item>

        <Form.Item
          label="Recording"
          name="recording"
          rules={[
            { required: true, message: 'Please input!' }
          ]}
        >
          <input type="file" placeholder="Enter recording" name="recording" className='form-control' onChange={handleRecordingChange} required />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 6, span: 16 }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <span style={{ margin: '10px' }} />
          <Button type="primary" onClick={resetData}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default AddTrackingData;


















