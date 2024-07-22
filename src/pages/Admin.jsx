import SiderComponent from '../components/layout/SiderComponent';
import HeaderComponent from '../components/layout/HeaderComponent';
import FooterComponent from '../components/layout/FooterComponent';
import AdminComponent from '../components/admin/AdminComponent';
import React from 'react';

function Admin() {
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
    const currentDate = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = days[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();

    const dateString = `${day}, ${date} ${month} ${year}`;

    const firstName = userData ? userData.firstName : '';
    return (
        <>
            <div className='mainBgImg'>
                <div className='row m-0 p-0 '>
                    <div className='m-0 p-0 col-2'  >
                        <SiderComponent />
                    </div>
                    <div className=' me-0 p-0 col-10 border'>
                        <div className=''>
                            <HeaderComponent />
                        </div>

                        <div className='pt-4 pe-5 ps-5' >
                            <div className="d-flex justify-content-center align-items-center flex-column" >
                                <p className=''>{dateString}</p>
                                <h2>Hello, {firstName}</h2>
                            </div>
                            <AdminComponent />
                        </div>
                        <div className=''>
                            <FooterComponent />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Admin;