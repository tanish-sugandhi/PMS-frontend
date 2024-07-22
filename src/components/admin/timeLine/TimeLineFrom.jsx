import React, { useState, useEffect } from 'react';
import { Button, DatePicker, message, Form, Tabs, Table } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import StageTimeLineService from "../../../services/StageTimeLineService";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import StageThree from "./StageThree";
import StageFour from "./StageFour";
import StageFive from "./StageFive";
import StageSix from "./StageSix";
import StageSeven from "./StageSeven";
import dayjs from 'dayjs';

const predefinedStageNames = [
    "PERFORMANCE_CYCLE",
    "GOAL_SETTING",
    "GOAL_APPROVAL",
    "GOAL_EXECUTION",
    "PEER_FEEDBACK",
    "SELF_FEEDBACK",
    "MANAGER_FEEDBACK"
];
const columns = [
    {
        title: 'S.No.',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        width: 80
    },
    {
        title: 'Stage Name',
        dataIndex: 'stageName',
        key: 'stageName',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (_, record) => (
            record?.startDate &&
            <>
                <span className="">
                    {moment(record?.startDate).format('YYYY-MM-DD')}
                </span>
                <span className='ms-3'>
                    {moment(record?.startDate).format('hh:mm A')}
                </span>
            </>
        )
    },
    {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (_, record) => (
            record?.endDate &&
            <>
                <span className="">
                    {moment(record?.endDate).format('YYYY-MM-DD')}
                </span>
                <span className='ms-3'>
                    {moment(record?.endDate).format('hh:mm A')}
                </span>
            </>
        )
    },
];
const TimeLineForm = () => {
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    const [timeLineData, setTimeLineData] = useState([]);
    const [newTimeLine, setNewTimeLine] = useState({});
    const [editingKey, setEditingKey] = useState('');
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isNextPageDisabled, setIsNextPageDisabled] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Add state to force re-fetching data
    const stageName = predefinedStageNames[page - 1];
    const [yearlyRecord, setYearlyRecord] = useState([]);
    const [allData, setAllData] = useState();
    const [view, setView] = useState(false);
    const [timelineId, setTimelineId] = useState(null);

    const [stageDates, setStageDates] = useState({
        1: { startDate: null, endDate: null },
        2: { startDate: null, endDate: null },
        3: { startDate: null, endDate: null },
        4: { startDate: null, endDate: null },
        5: { startDate: null, endDate: null },
        6: { startDate: null, endDate: null },
        7: { startDate: null, endDate: null }
    });

    const fetchStageData = async () => {
        try {
            const stageData = await StageTimeLineService.getStageWithTimelineByName(stageName);
            // console.log("sssssssssssssssssssssssssssssssssssssssssssssss")
            // console.log(stageData);

            if (stageData) {
                const currentYear = moment().year();
                const filteredData = stageData.filter(item => moment(item.startDate).year() === currentYear);
                console.log(filteredData[0].timelineId)
                console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
                const currentDate = moment();
                const endDate = filteredData[0].endDate ? moment(filteredData[0].endDate) : null;

                setNewTimeLine({
                    ...filteredData[0],
                    startDate: filteredData[0].startDate ? moment(filteredData[0].startDate) : null,
                    endDate: filteredData[0].endDate ? moment(filteredData[0].endDate) : null
                });
                form.setFieldsValue({
                    description: filteredData[0].description,
                    startDate: filteredData[0].startDate ? moment(filteredData[0].startDate) : null,
                    endDate: filteredData[0].endDate ? moment(filteredData[0].endDate) : null
                });
                setStageDates(prevDates => ({
                    ...prevDates,
                    [page]: {
                        startDate: filteredData[0].startDate ? moment(filteredData[0].startDate) : null,
                        endDate: filteredData[0].endDate ? moment(filteredData[0].endDate) : null
                    }
                }));
                setTimelineId(filteredData[0].timelineId);
                setIsEditMode(true);

                if (filteredData[0].stageName === "PERFORMANCE_CYCLE") {
                    setIsNextPageDisabled(false);
                }
                else {
                    // setIsNextPageDisabled((!(currentDate.isSameOrAfter(endDate))));
                    setIsNextPageDisabled(false);
                }

            } else {
                setNewTimeLine({ stageName });
                form.resetFields();
                setIsEditMode(false);
                setIsNextPageDisabled(true);
            }
        } catch (error) {
            setNewTimeLine({ stageName });
            form.resetFields();
            if (page === 2) {
                if (!stageDates[page].startDate) {
                    const startDateOfCurrentPage = stageDates[page - 1].startDate;
                    setNewTimeLine(prevTimeLine => ({
                        ...prevTimeLine,
                        startDate: startDateOfCurrentPage || null,
                        endDate: null
                    }));
                    form.setFieldsValue({
                        startDate: startDateOfCurrentPage || null,
                        endDate: null
                    });
                    // console.log("nextttttttttttttttttttooooo2222222222222")
                }
            }
            else if (page === 3 || page === 4 || page === 5 || page === 6) {
                if (!stageDates[page].startDate) {
                    const startDateOfCurrentPage = stageDates[page - 1].endDate;
                    setNewTimeLine(prevTimeLine => ({
                        ...prevTimeLine,
                        startDate: startDateOfCurrentPage || null,
                        endDate: null
                    }));
                    form.setFieldsValue({
                        startDate: startDateOfCurrentPage || null,
                        endDate: null
                    });
                    // console.log("nextttttttt3333444455556666")
                }
            }
            else if (page === 7) {
                if (!stageDates[page].startDate) {
                    const startDateOfCurrentPage = stageDates[page - 1].endDate;
                    const endDateOfCurrentPage = stageDates[1].endDate;
                    setNewTimeLine(prevTimeLine => ({
                        ...prevTimeLine,
                        startDate: startDateOfCurrentPage || null,
                        endDate: endDateOfCurrentPage || null
                    }));
                    form.setFieldsValue({
                        startDate: startDateOfCurrentPage || null,
                        endDate: endDateOfCurrentPage || null
                    });
                    // console.log("nextttttttttttttttttttooooo7777777777777")
                }
            }
            console.error('Error fetching stage data:', error);
            setIsEditMode(false);
            setIsNextPageDisabled(true); // Disable next page button if there's an error
        }
    };
    const fetchAllTimelines = async () => {
        const response = await StageTimeLineService.getAllStagesWithTimeline();
        setAllData(response?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            year: new Date(item?.startDate).getFullYear()
        })));
        const years = response?.map(item => new Date(item?.startDate).getFullYear());
        const uniqueYearsSet = new Set(years);
        setYearlyRecord(Array.from(uniqueYearsSet));
        // console.log(response);
    }
    useEffect(() => {
        fetchStageData();
        fetchAllTimelines();
    }, [page, stageName, refreshKey]);

    useEffect(() => {
        // console.log("Updated stageDates:", stageDates);
    }, [stageDates, page]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTimeLine(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDateChange = (fieldName, value) => {
        setNewTimeLine(prevState => ({ ...prevState, [fieldName]: value }));
        setStageDates(prevDates => ({
            ...prevDates,
            [page]: {
                ...prevDates[page],
                [fieldName]: value
            }
        }));
    };
    const handleSubmit = async () => {
        try {
            const { description, startDate, endDate } = newTimeLine;
            const formattedStartDate = startDate ? startDate.format('YYYY-MM-DDTHH:mm:ss') : null;
            const formattedEndDate = endDate ? endDate.format('YYYY-MM-DDTHH:mm:ss') : null;
            const newEntry = {
                ...newTimeLine,
                key: timeLineData.length + 1,
                serialNumber: timeLineData.length + 1,
                startDate: formattedStartDate,
                endDate: formattedEndDate
            };
            // console.log(newEntry);
            await StageTimeLineService.saveStage(newEntry);
            message.success('Data added successfully');
            setRefreshKey(prevKey => prevKey + 1); // Force re-fetching data

        } catch (error) {
            console.error('Error saving stage:', error);
            message.error('Failed to add data');
        }
    };
    const handleSave = async () => {
        try {
            const { description, startDate, endDate } = newTimeLine;
            const formattedStartDate = startDate ? startDate.format('YYYY-MM-DDTHH:mm:ss') : null;
            const formattedEndDate = endDate ? endDate.format('YYYY-MM-DDTHH:mm:ss') : null;

            await StageTimeLineService.updateStage(timelineId, {
                stageName,
                description,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                isActive: true
            });
            // console.log(formattedStartDate);
            message.success('Data updated successfully');
            setEditingKey('');
            // setIsEditMode(true);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error updating stage:', error);
            message.error('Failed to update data');
        }
    };
    const handleNextPage = () => {
        if (!isNextPageDisabled && page < 7) {
            const nextPage = page + 1;
            setPage(nextPage);
        }
    };
    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };
    const renderStage = () => {
        switch (page) {
            case 1:
                return <StageOne />;
            case 2:
                return <StageTwo />;
            case 3:
                return <StageThree />;
            case 4:
                return <StageFour />;
            case 5:
                return <StageFive />;
            case 6:
                return <StageSix />;
            case 7:
                return <StageSeven />;
            default:
                return <StageOne />;
        }
    };

    // Function to determine disabled dates for startDate based on current page
    const disabledStartDate = (current) => {
        if (!current) return false; // Allow selection of dates

        switch (page) {
            case 1:
                return current && current < moment().startOf('day');
            case 2:
                return current && current < moment(stageDates[1].startDate);
            case 3:
            case 4:
            case 5:
            case 6:
                return current && current < moment(stageDates[page - 1].endDate);
            case 7:
                return current && (current < moment(stageDates[page - 1].endDate) || current > moment(stageDates[1].endDate));
            default:
                return false;
        }
    };
    const getFilteredDataByYear = (year) => {
        return allData?.filter(item => item.year == year);
    }
    const viewMoreTimeLine = () => {
        setView(!view);
    }
    return (
        <>
            <div className='d-flex flex-column'>
                <div style={{ width: '94%' }}>
                    {(userData?.job !== "HR") && (
                        <i class="fa-solid fa-list-ul float-end" style={{ fontSize: '25px', color: '#001529' }} onClick={viewMoreTimeLine}></i>
                    )}
                </div>
                {(view || userData?.job === "HR") && (
                    <div className='ps-5 pe-5 pt-2'>
                        <Tabs
                            defaultActiveKey="1"
                            tabPosition={'top'}
                            style={{
                                height: 100,
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
                                            style={{ overflow: 'visible', fontSize: '16px' }}
                                            scroll={{
                                                y: 400,
                                            }}
                                        ></Table>
                                };
                            })}
                        />
                    </div>
                )}
                {!view && userData?.job !== "HR" && (
                    <div>
                        <div className="row bg-white mt-3" style={{ width: '805px', borderRadius: '10px', border: '1px solid rgb(180, 178, 178)' }}>
                            {renderStage()}
                            <div className="col-md-6 pt-5 pe-5 ps-5 pb-4">
                                <Form
                                    form={form}
                                    name="timeline"
                                    initialValues={{ remember: true }}
                                    layout="vertical"
                                    onFinish={isEditMode ? handleSave : handleSubmit}
                                >
                                    <Form.Item
                                        label="Description"
                                        name="description"
                                        rules={[{ required: true, message: 'Please enter the description!' }]}
                                        className='m-0 p-0'
                                    >
                                        <textarea
                                            placeholder="Description of timeline"
                                            name="description"
                                            value={newTimeLine.description || ''}
                                            onChange={handleInputChange}
                                            style={{ width: '100%', borderRadius: '5px', padding: '3px', height: '90px' }}
                                        />
                                    </Form.Item>
                                    <div className='d-flex'>
                                        <Form.Item
                                            label="Start Date"
                                            name="startDate"
                                            rules={[{ required: true, message: 'Please select the start date!' }]}
                                        >
                                            <DatePicker
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"
                                                name="startDate"
                                                value={newTimeLine.startDate}
                                                onChange={(date) => handleDateChange('startDate', date)}
                                                minDate={
                                                    newTimeLine.startDate
                                                        ? dayjs(newTimeLine.startDate)
                                                        : (stageDates[page - 1] && stageDates[page - 1].endDate
                                                            ? dayjs(stageDates[page - 1].endDate)
                                                            : dayjs())
                                                }

                                                maxDate={
                                                    stageDates[1] && stageDates[1].endDate
                                                        ? moment(stageDates[1].endDate)
                                                        : moment().endOf('year').add(1, 'year')}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="End Date"
                                            name="endDate"
                                            rules={[{ required: true, message: 'Please select the end date!' }]}
                                            className='ms-2'
                                        >
                                            <DatePicker
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"
                                                name="endDate"
                                                value={newTimeLine.endDate}
                                                onChange={(date) => handleDateChange('endDate', date)}
                                                minDate={
                                                    newTimeLine.startDate
                                                        ? dayjs(newTimeLine.startDate)
                                                        : (stageDates[page - 1] && stageDates[page - 1].endDate
                                                            ? dayjs(stageDates[page - 1].endDate)
                                                            : dayjs())
                                                }

                                                maxDate={
                                                    stageDates[1] && stageDates[1].endDate
                                                        ? moment(stageDates[1].endDate)
                                                        : moment().endOf('year').add(1, 'year')}
                                            />
                                        </Form.Item>
                                    </div>
                                    {/* {(isNextPageDisabled || page === 1) && ( */}
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={isEditMode ? <EditOutlined /> : <SaveOutlined />}
                                            style={{ width: '100%', fontSize: '18px' }}
                                        >
                                            {isEditMode ? 'Edit' : 'Save'}
                                        </Button>
                                    </Form.Item>
                                    {/* )} */}

                                </Form>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center align-items-center mt-2">
                            <Button
                                type="primary"
                                shape="circle"

                                icon={<ArrowLeftOutlined />}
                                size="large"
                                onClick={handlePreviousPage}
                                style={{ marginRight: '10px' }}
                                disabled={page === 1}
                            />
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<ArrowRightOutlined />}
                                size="large"
                                onClick={handleNextPage}
                                disabled={isNextPageDisabled || page === 7}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
export default TimeLineForm;