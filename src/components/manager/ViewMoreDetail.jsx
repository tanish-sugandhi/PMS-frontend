

import React, { useEffect, useState } from 'react';
import SiderComponent from '../layout/SiderComponent';
import FooterComponent from '../layout/FooterComponent';
import HeaderComponent from '../layout/HeaderComponent';
import { Button, Drawer, Segmented, Table, Popconfirm, message, Tabs } from 'antd';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeFeedback from './EmployeeFeedback';
import EmployeeGoal from './EmployeeGoal';
import EmployeeReport from './EmployeeReport';
import { setUserData } from '../redux/UserSlice';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import AddTrackingData from '../progressTracking/AddTrackingData';
const ViewMoreDetail = () => {
  const token = JSON.parse(localStorage.getItem("token")).token;
  const location = useLocation();
  const { employeeRecord } = location?.state || {}; // Default to an empty object if state is undefined
  const [selectedOption, setSelectedOption] = useState('summer'); // Default to 'summer'
  const [employeeData, setEmployeeData] = useState([]);
  const [placement, setPlacement] = useState('right');
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [yearlyRecord, setYearlyRecord] = useState([]);
  const [page, setPage] = React.useState(1);
  //const { userData,value } = useSelector((state) => state.currentUser);
  const currentUserD = JSON.parse(localStorage.getItem("currentUser"));
  const { userData } = useSelector((state) => state.currentUser);
  // console.log("user data ", userData);
  const handleSegmentChange = (value) => {
    setSelectedOption(value);
  };

  console.log("employee recoird ", employeeRecord);

  useEffect(() => {
    console.log("use effectsss");
    //const { employeeRecord } = location?.state || {}; 
    personalEmployeeData();
  }, []);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };
  const personalEmployeeData = async () => {
    const userId = employeeRecord?.key;
    if (!userId) {
      console.error("userId is undefined");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/progress/get/user/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setEmployeeData(response?.data);
      const years = response?.data?.map(item => (item?.year));
      const uniqueYearsSet = new Set(years);
      setYearlyRecord(Array.from(uniqueYearsSet));
      dispatch(setUserData(response?.data))

    } catch (error) {
      console.log(error);
    }
  }
  const deleteTracking = async (value) => {
    try {
      await axios.delete(`http://localhost:8080/api/progress/deleteData/${value}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setEmployeeData(employeeData.filter(item => item.meetingId !== value)); // Update state without reload
      personalEmployeeData(employeeRecord?.key);
      message.success('data deleted successfully')
    } catch (error) {
      message.error('failed to delete');
      console.log(error);
    }
  }

  const updateTracking = async (value) => {
    navigate(`/api/progress/updateData/${value}`, { state: { employeeRecord } });
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Month',
      dataIndex: 'month',
    },
    // {
    //   title: 'Year',
    //   dataIndex: 'year',
    // },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (text, record) => (<Link to={record.notes} target="_blank">Open Notes</Link>)
    },
    {
      title: 'Recording',
      dataIndex: 'recording',
      key: 'recording',
      render: (text, record) => (<Link to={record.recording} target="_blank">Open Recording</Link>)
    },
    currentUserD?.job !== 'HR' ? {
      title: 'Delete',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        // <>
        //   <button type="button" className="btn btn-outline-success" style={{ marginRight: '10px' }} onClick={() => { updateTracking(record.meetingId) }} >Update</button>
        //   <button type="button" className="btn btn-outline-danger" onClick={() => deleteTracking(record.meetingId)} >Delete</button>
        // </>
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => deleteTracking(record.meetingId)}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <Button
            className='btn btn-dark'
            icon={<DeleteOutlined />}
          >
          </Button>
        </Popconfirm>
      )
    } : {},
    currentUserD?.job !== 'HR' ? {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      render: (text, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => { updateTracking(record.meetingId) }}
        ></Button>
      )
    } : {},
  ];

  const mappedData = userData?.map((item, index) => ({
    UserId: item.UserId,
    key: index + 1,
    serialNumber: index + 1,
    meetingId: item.meetingId,
    title: item.title,
    date: item.date,
    month: item.month,
    year: item.year,
    notes: item.notes,
    recording: item.recording,
  }));
  const getFilteredDataByYear = (year) => {
    return mappedData?.filter(progress => progress.year == year).map((item, index) => ({
      key: index + 1,
      serialNumber: index + 1,
      meetingId: item.meetingId,
      title: item.title,
      date: item.date,
      month: item.month,
      year: item.year,
      notes: item.notes,
      recording: item.recording,
    }));
  }

  const renderDataTable = () => {
    return (
      <div>
      { currentUserD?.job 
        !== 'HR' && (
        <div className='col text-end'>
          <Button className="btn btn-primary ms-auto" style={{ boxShadow: '2px 2px 2px 2px #AFACAC' }} onClick={() => showDrawer()}>
            <i className="fa-solid fa-plus me-2" style={{ fontSize: '13px' }}></i> Add Progress
          </Button>
        </div>
      )}
        <div className='mt-2'>
          {userData?.length == 0 ? <Table
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
                    <Table columns={columns} dataSource={getFilteredDataByYear(year)} />
                };
              })}
            />
          }
          {/* <Segmented options={['Personal', 'Organisational']} block onChange={()=>{}} /> */}
           {/* <Table columns={columns} dataSource={mappedData} /> */}
        </div>
      </div >
    );
  };


return (
  <>
    <div className='row m-0 p-0 mainBgImg'>
      <div className='m-0 p-0 col-2'>
        <SiderComponent />
      </div>
      <div className='me-0 p-0 col-10'>
        <div>
          <HeaderComponent />
        </div>
        <div className='pt-5 ps-5 pe-5 d-flex'>
          <div className='d-flex flex-column col-3'>
            <h2 className='m-0 p-0' style={{ color: 'blue' }}>{employeeRecord?.firstName} {employeeRecord?.lastName}</h2>
            <span style={{ fontWeight: '600', fontSize: '18px', color: '#001529' }}>{employeeRecord?.email}</span>
          </div>
          <div className='col-9 '>
            <Segmented
              className='bg-secondary text-white custom-segmented'
              size='large'
              block
              options={[
                {
                  label: (
                    <div style={{ padding: 2 }}>
                      <div>Goal</div>
                    </div>
                  ),
                  value: 'goal',
                },
                {
                  label: (
                    <div style={{ padding: 2 }}>
                      <div>Progress Tracking</div>
                    </div>
                  ),
                  value: 'progress',
                },
                {
                  label: (
                    <div style={{ padding: 2 }}>
                      <div>Feedbacks</div>
                    </div>
                  ),
                  value: 'feedback',
                },
                {
                  label: (
                    <div style={{ padding: 2 }}>
                      <div>Report</div>
                    </div>
                  ),
                  value: 'report',
                },
              ]}
              onChange={handleSegmentChange}
              value={selectedOption}
            />
          </div>
        </div>
        <div className='ms-5 me-5 mt-4'>
          {
            selectedOption === 'progress' ? renderDataTable() :
              selectedOption === 'feedback' ? <EmployeeFeedback data={employeeRecord} /> :
                selectedOption === 'report' ? <EmployeeReport /> : <EmployeeGoal data={employeeRecord} />}
        </div>
        <div>
          <FooterComponent />
        </div>
      </div>
    </div>

    <Drawer
      title="New Progress"
      placement={placement}
      closable={false}
      onClose={onClose}
      open={openDrawer}

    >
      <AddTrackingData employeeAdd={employeeRecord} onClose={onClose} onGoalAdded={personalEmployeeData} />
    </Drawer>
  </>
);
};


export default ViewMoreDetail;








