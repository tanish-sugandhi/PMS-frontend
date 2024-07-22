import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import UserService from '../../services/UserService';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    useEffect(() => {
        UserService.getAllUsers(token).then(response => {
            setUsers(response.data);
            // console.log("userList :: " + response.data);
        })
            .catch(err => console.log(err));
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className='d-flex flex-column '>
                    <div className='d-flex flex-row'>
                        <div className="mt-0 me-2 d-flex flex-row justify-content-center align-item-center m-0 p-0" style={{ height: '30px', width: '30px', borderRadius: '50%', backgroundColor: '#0d6efd' }}>
                            <span className="text-center text-white " style={{ fontWeight: '600', fontSize: '17px' }}>{record.firstName.charAt(0).toUpperCase()}</span>
                        </div>
                        <span style={{ marginLeft: 8 }}>{record.firstName} {record.lastName}</span>
                    </div>
                    <p style={{ marginLeft: 45, padding: '0px', marginTop: '-12px' }}>{record.email}</p>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role.name === 'ADMIN' ? 'black' : '#0d6efd'}>
                    {role.name}
                </Tag>
            ),
            width: 100,
        },
    ];

    return (
        <Table
            style={{ height: '250px' }}
            columns={columns}
            dataSource={users.map(user => ({
                key: user.userId,
                ...user
            }))}
            pagination={false}
            scroll={{ y: 220 }}
        />
    );
};

export default UserList;