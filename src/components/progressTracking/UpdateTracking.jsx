import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SiderComponent from "../layout/SiderComponent";
import HeaderComponent from "../layout/HeaderComponent";
import FooterComponent from "../layout/FooterComponent";
import { DatePicker, Select, message } from 'antd';
import dayjs from 'dayjs';

const token = JSON.parse(localStorage.getItem("token"));

const UpdateTracking = () => {
    const { meetingId } = useParams();
    const location = useLocation();
    const { employeeRecord } = location?.state || {};
    const [selectedNotes, setSelectedNotes] = useState(null);
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [updateData, setUpdateData] = useState({
        title: '',
        month: '',
        year: '',
        notes: '',
        recording: ''
    });
    const navigate = useNavigate();

    console.log("updated ", updateData.notes)

    useEffect(() => {
        fetchData();
    }, [meetingId]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/progress/get/${meetingId}`, { headers: { "Authorization": `Bearer ${token.token}` } });
            setUpdateData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNotesChange=(e)=>{
                setUpdateData({...updateData,notes: e.target.files[0]})
    }
    const handleRecordingChange=(e)=>{
        setUpdateData({...updateData,recording: e.target.files[0]})
    }

    const handleTitleChange = (e) => {
        setUpdateData(prevFormData => ({
            ...prevFormData,
            title: e.target.value
        }));
    };

    const handleMonthChange = (value) => {
        setUpdateData(prevFormData => ({
            ...prevFormData,
            month: value
        }));
    };

    const handleYearChange = (date, dateString) => {
        setUpdateData(prevFormData => ({
            ...prevFormData,
            year: dateString
        }));
    };

    const update = async (e) => {
        e.preventDefault();
        console.log("Data before update:", updateData);
        
        try {
            let trackingData = new FormData();
            trackingData.append('title', updateData.title);
            trackingData.append('month', updateData.month);
            trackingData.append('year', updateData.year);
           trackingData.append('notes', updateData.notes);
          trackingData.append('recording', updateData.recording);

            const response = await axios.put(`http://localhost:8080/api/progress/updateData/${meetingId}`, trackingData, { headers: { "Authorization": `Bearer ${token.token}`,'Content-Type': 'multipart/form-data', } });
            console.log('Value successfully updated', response.data);
            message.success('Data updated successfully');
            navigate(`/viewMoreDetail`, { state: { employeeRecord } });
        } catch (error) {
            message.error('Failed to update');
            console.error('Update failed', error);
        }
    };

    return (
        <div>
            <div className='row m-0 p-0'>
                <div className='m-0 p-0 col-2'>
                    <SiderComponent />
                </div>
                <div className='me-0 p-0 col-10 border'>
                    <HeaderComponent />
                    <div className='mt-3 p-5'>
                        <div className="container">
                            <h2 className='text-center'>PMS System</h2>
                        </div>
                        <form onSubmit={update} encType="multipart/form-data">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input type="text" className="form-control" id="title" value={updateData.title} name="title" onChange={handleTitleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="month">Month</label>
                                <Select
                                    id="month"
                                    value={updateData.month}
                                    onChange={handleMonthChange}
                                    style={{ width: '100%' }}
                                >
                                    {[
                                        'January', 'February', 'March', 'April',
                                        'May', 'June', 'July', 'August',
                                        'September', 'October', 'November', 'December'
                                    ].map(month => (
                                        <Select.Option key={month} value={month}>
                                            {month}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="year">Year</label>
                                <DatePicker
                                    id="year"
                                    picker="year"
                                    value={updateData.year ? dayjs(updateData.year, 'YYYY') : null}
                                    onChange={handleYearChange}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Notes</label>
                                <input type="file" className="form-control" id="notes" name="notes"  onChange={handleNotesChange} />
                                <div>Notes: {selectedNotes?.name || typeof updateData.notes=='string' ? updateData?.notes?.split("/")[3]:'No Notes available'}</div>
                            </div> 

                            <div className="form-group">
                                <label htmlFor="recording">Recording</label>
                                <input type="file" className="form-control" id="recording" name="recording" onChange={handleRecordingChange} />
                                <div>Recording: {selectedRecording?.name || typeof updateData.recording=='string' ? updateData?.recording?.split("/")[3]:'No Recording available'}</div>
                            </div>

                            <button type='submit' className="btn btn-primary" style={{ marginToSp: '10px'}}>Update</button>
                        </form>
                    </div>
                    <FooterComponent />
                </div>
            </div>
        </div>
    );
};

export default UpdateTracking;













