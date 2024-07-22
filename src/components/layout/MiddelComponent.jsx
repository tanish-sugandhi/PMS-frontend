import React, { useState, useEffect } from 'react';
import UserList from '../user/UserList';
import UserService from '../../services/UserService';

const MiddelComponent = () => {
    const [managerData, setManagerData] = useState(null);
    const currentDate = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = days[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();
    const dateString = `${day}, ${date} ${month} ${year}`;
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    const token = JSON.parse(localStorage.getItem("token")).token;
    useEffect(() => {
        const fetchManagerData = async () => {
            try {
                if (userData && userData.managerId) {
                    const response = await UserService.getUserById(token, userData.managerId).then(res => res).catch(err => console.log(err));
                    // console.log('Manager data:', response);
                    setManagerData(response);
                } else {
                    console.log("No user data found in localStorage.");
                }
            } catch (error) {
                console.error('Error fetching manager data:', error);
            }
        };

        fetchManagerData();
    }, []);
    const firstName = userData ? userData.firstName : '';

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-center align-items-center flex-column " >
                    <p className='mt-5'>{dateString}</p>
                    <h2>Hello, {firstName}</h2>
                </div>
                <div className='row'>
                    <div className='d-flex justify-content-around'>
                        <div className='col-6 lineManagerBg p-5 mt-3 d-flex justify-content-center align-items-center' style={{ borderRadius: '15px', borderRadius: '15px', boxShadow: '3px 1px 1px 2px #daebeb' }}>
                            <div className="lineManagerBgContain justify-content-center align-items-center p-5">
                            <h2>My Line Manager</h2>
                            <div className='d-flex flex-row  justify-content-center align-items-center'>
                                <div className='d-flex'>
                                    <div className="mt-2 me-2 d-flex flex-row justify-content-center align-items-center" style={{ height: '30px', width: '30px', borderRadius: '50%', backgroundColor: '#007bff' }}>
                                        <span className="text-center text-white " style={{ fontWeight: '600', fontSize: '18px' }}>{managerData?.data.firstName.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <span style={{fontWeight:600}}>{managerData ? managerData.data.firstName + ' ' + managerData.data.lastName : 'Loading...'}</span>
                                        <span style={{fontWeight:600}}>{managerData ? managerData.data.email : 'Loading...'}</span>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className='col-5 p-5 mt-3 bg-white' style={{ borderRadius: '15px', boxShadow: '3px 1px 1px 5px #daebeb' }}>
                            <div>
                                <header className="App-header">
                                    <h1>Colleagues</h1>
                                </header>
                                <UserList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MiddelComponent;