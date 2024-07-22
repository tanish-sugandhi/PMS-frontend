import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { HomeOutlined, UserOutlined, ClockCircleOutlined, MessageOutlined, LineChartOutlined, FileTextOutlined, TeamOutlined, } from '@ant-design/icons';
import React from 'react';
import logo from '../../image/logo.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserService from '../../services/UserService.jsx';
const token = JSON.parse(localStorage.getItem("token"))?.token;
const SiderComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkManager, setCheckManager] = useState([]);
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.userId;
  const userData = JSON.parse(localStorage.getItem("currentUser"));
  if (userData) {
    try {
      // console.log("User Object :::::", userData);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  } else {
    console.log("No user data found in localStorage.");
  }
  const [selectedKey, setSelectedKey] = useState('1');
  const fetchEmployee = async () => {
    try {
      const response = await UserService.getByEmployeesUnderMe(token, userId);
      setCheckManager(response);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const pathToKeyMap = {
      '/admin': '1',
      '/home': '1',
      'hrpage': '1',
      '/goals': '2',
      '/api/progress/getAllTrackingData': '3',
      '/feedback': '4',
      '/feedback/request': '4',
      '/feedback/peer': '4',
      '/feedback/self': '4',
      '/feedback/manager': '4',
      '/feedback/provide': '4',
      '/report': '5',
      '/timeline': '6',
      '/employeeList': '7',
      '/viewMoreDetail': '7',
    };
    setSelectedKey(pathToKeyMap[location.pathname] || '1');
  }, [location.pathname]);
  useEffect(() => {
    fetchEmployee()
  }, [userId])
  const roleName = userData ? userData.role.name : '';
  const items = checkManager?.body?.length > 0 ?
    (userData.job === "HR" ? [
      {
        key: 1,
        icon: React.createElement(HomeOutlined),
        label: 'Home',
      },
      {
        key: 2,
        icon: React.createElement(UserOutlined),
        label: 'Goals',
      },
      {
        key: 3,
        icon: React.createElement(LineChartOutlined),
        label: 'Progress Tracking',
      },
      {
        key: 4,
        icon: React.createElement(MessageOutlined),
        label: 'Feedbacks',
      },
      {
        key: 5,
        icon: React.createElement(FileTextOutlined),
        label: 'Report',
      },
      {
        key: '6',
        icon: React.createElement(ClockCircleOutlined),
        label: 'Time Line',
      },
      {
        key: '7',
        icon: React.createElement(TeamOutlined),
        label: 'All Users'
      }
    ] : [
      {
        key: 1,
        icon: React.createElement(HomeOutlined),
        label: 'Home',
      },
      {
        key: 2,
        icon: React.createElement(UserOutlined),
        label: 'Goals',
      },
      {
        key: 3,
        icon: React.createElement(LineChartOutlined),
        label: 'Progress Tracking',
      },
      {
        key: 4,
        icon: React.createElement(MessageOutlined),
        label: 'Feedbacks',
      },
      {
        key: 5,
        icon: React.createElement(FileTextOutlined),
        label: 'Report',
      },
      ...(roleName !== 'USER' ? [{
        key: '6',
        icon: React.createElement(ClockCircleOutlined),
        label: 'Time Line',
      }] : []),
      {
        key: '7',
        icon: React.createElement(TeamOutlined),
        label: 'Manager Dashboard'
      }
    ]) :
    (userData.job === "HR" ? [
      {
        key: 1,
        icon: React.createElement(HomeOutlined),
        label: 'Home',
      },
      {
        key: 2,
        icon: React.createElement(UserOutlined),
        label: 'Goals',
      },
      {
        key: 3,
        icon: React.createElement(LineChartOutlined),
        label: 'Progress Tracking',
      },
      {
        key: 4,
        icon: React.createElement(MessageOutlined),
        label: 'Feedbacks',
      },
      {
        key: 5,
        icon: React.createElement(FileTextOutlined),
        label: 'Report',
      },
      {
        key: '6',
        icon: React.createElement(ClockCircleOutlined),
        label: 'Time Line',
      },
      {
        key: '7',
        icon: React.createElement(TeamOutlined),
        label: 'All Users'
      }
    ] : [
      {
        key: 1,
        icon: React.createElement(HomeOutlined),
        label: 'Home',
      },
      {
        key: 2,
        icon: React.createElement(UserOutlined),
        label: 'Goals',
      },
      {
        key: 3,
        icon: React.createElement(LineChartOutlined),
        label: 'Progress Tracking',
      },
      {
        key: 4,
        icon: React.createElement(MessageOutlined),
        label: 'Feedbacks',
      },
      {
        key: 5,
        icon: React.createElement(FileTextOutlined),
        label: 'Report',
      },
      ...(roleName !== 'USER' ? [{
        key: '6',
        icon: React.createElement(ClockCircleOutlined),
        label: 'Time Line',
      }] : [])
    ]);
  return (
    <div className='ps-4' style={{ height: '100vh', width: '247px', position: 'fixed', backgroundColor: '#001529' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
      >
        <div className="demo-logo d-flex">
          <img src={logo} alt='logo' className="mt-3 me-1 ms-1" style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
          <h3 className='m-0 pt-3 text-center'>PMS</h3>
        </div>
        <Menu theme="dark" className='pt-5'
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          onClick={(e) => {
            switch (e.key) {
              case '1':
                if (roleName === 'ADMIN') {
                  navigate("/admin");
                } else if (roleName === 'USER') {
                  if (userData.job === "HR") {
                    navigate("/hrpage");
                  }
                  else {
                    navigate("/home");
                  }
                } else {
                  navigate("/");
                }
                break;
              case '2':
                navigate("/goals");
                break;
              case '3':
                navigate("/api/progress/getAllTrackingData");
                break;
              case '4':
                navigate("/feedback");
                break;
              case '5':
                navigate("/report");
                break;
              case '6':
                navigate("/timeline");
                break;
              case '7':
                navigate("/employeeList")
                break;
              default:
                break;
            }
          }} />
      </Sider>
    </div>
  );
};
export default SiderComponent;