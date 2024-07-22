import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Space, Table } from 'antd';
import SiderComponent from "../layout/SiderComponent";
import HeaderComponent from "../layout/HeaderComponent";
import FooterComponent from "../layout/FooterComponent";
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const tokenData = JSON.parse(localStorage.getItem("token"));
const EmployeeList = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const tokenData = JSON.parse(localStorage.getItem("token"));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.job === "HR") {
      UserService.getAllUsers(tokenData.token).then(response => {
        const res = response.data.map((employee, index) => ({
          ...employee,
          serialNumber: index + 1,
          key: employee.userId,
          name: employee.firstName + ' '+employee.lastName
        }));
        setData(res);
      })
        .catch(err => console.log(err));
    }
    else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const userId = currentUser.userId;
      const token = tokenData.token;
      const response = await UserService.getByEmployeesUnderMe(token, userId);

      const responseData = response?.body || [];
      const formattedData = responseData.map((employee, index) => ({
        key: employee.userId,
        userId: employee.userId,
        serialNumber: index + 1,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        job: employee.job,
        name: employee.firstName +" " + employee.lastName
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: '10%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      // render: (text, record) => `${record.firstName} ${record.lastName}`,
      width: '20%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '30%',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Job',
      dataIndex: 'job',
      width: '20%',
      ...getColumnSearchProps('job'),
    },
    {
      title: 'View More',
      key: 'view',
      render: (text, record) => (
        <Button onClick={() => handleClick(record)}>Details</Button>
      ),
      width: '10%',
    },
  ];

  const handleClick = (record) => {

    const name = record?.firstName;
    setName(name);
    console.log(record);
    navigate("/viewMoreDetail", { state: { employeeRecord: record } });
  };

  return (
    <div className='row m-0 p-0'>
      <div className='m-0 p-0 col-2'>
        <SiderComponent />
      </div>
      <div className='me-0 p-0 col-10 '>
        <div>
          <HeaderComponent />
        </div>
        <div className='p-5 mainBgImg' style={{ height: '650px' }}>
          <h3 className='mb-3'>Employee List</h3>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            loading={loading}
            rowKey="key"
          />
        </div>
        <div>
          <FooterComponent />
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;