import { useState,useRef, useEffect } from "react";
import { Drawer, Table, Button, Popconfirm,Input, Space } from 'antd';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import baseUrl from "../../api/bootapi";
import Swal from 'sweetalert2';
import Add from "../user/Add";
import UpdateForm from "../user/UpdateForm";
import UserService from '../../services/UserService';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const AdminComponent = () => {
    const [employee, setEmployee] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [placement, setPlacement] = useState('right');
    const [page, setPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Function to show the drawer for adding or editing
    const showDrawer = (isEdit = false, employee = null) => {
        setIsEditing(isEdit);
        setSelectedEmployee(employee);
        setOpenDrawer(true);
    };

    // Function to close the drawer
    const onClose = () => {
        setOpenDrawer(false);
        setSelectedEmployee(null);
        setIsEditing(false);
    };

    // Function to fetch all employees with the manager's email
    const viewAllEmployee = async (token) => {
        try {
            const response = await UserService.getAllUsersWithManagerEmail(token);
            setEmployee(response.data);
        } catch (error) {
            console.error("Something went wrong!!!", error);
        }
    };

    // Fetch all employees when the component mounts
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"))?.token;
        viewAllEmployee(token);
    }, []);

    // Function to handle the deletion of an employee
    const handleDelete = async (userId) => {
        const token = JSON.parse(localStorage.getItem("token"))?.token;
        await axios.delete(`${baseUrl}/api/user/softDelete/${userId}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(
                (response) => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The user has been deleted.',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    viewAllEmployee(token); // Refresh the employee list
                },
                (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong while deleting user!'
                    });
                }
            );
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

    // Table columns definition
    const columns = [
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'id',
        },
        {
            title: 'Name',
            key: 'name',
            render: (text, record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
            ...getColumnSearchProps('contact'),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role name',
            render: (role) => role.name,
        },
        {
            title: 'Job',
            dataIndex: 'job',
            key: 'job',
            ...getColumnSearchProps('job'),
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            render: (text, record) =>
                <Popconfirm
                    title="Are you sure to delete this user?"
                    onConfirm={() => handleDelete(record.userId)}
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
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            render: (text, record) => (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => showDrawer(true, record)}
                ></Button>
            ),
        },
    ];

    return (
        <>
            <div className="main">
                <div className="container-fluid">
                    <div className="d-flex text-end pe-5">
                        <button className="btn btn-dark ms-auto" style={{ boxShadow: '2px 2px 2px 2px #AFACAC' }} onClick={() => showDrawer()}>
                            Create User <i className="fa-solid fa-plus ms-1" style={{ fontSize: '13px' }}></i>
                        </button>
                    </div>
                    <Table
                        className="mt-3"
                        columns={columns}
                        dataSource={employee}
                        style={{ borderRadius: '15px', boxShadow: '3px 1px 1px 2px #DAEBEB' }}
                        pagination={{
                            current: page,
                            pageSize: 5,
                            onChange(current) {
                                setPage(current);
                            }
                        }}
                    />
                    <Drawer
                        title={isEditing ? "Update User" : "Register New User"}
                        placement={placement}
                        closable={false}
                        onClose={onClose}
                        open={openDrawer}
                        key={placement}
                    >
                        {isEditing ? (
                            <UpdateForm employee={selectedEmployee} onClose={onClose} viewAllEmployee={viewAllEmployee} />
                        ) : (
                            <Add onClose={onClose} viewAllEmployee={viewAllEmployee} />
                        )}
                    </Drawer>
                </div>
            </div>
        </>
    );
};

export default AdminComponent;