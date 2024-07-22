import SiderComponent from "../layout/SiderComponent";
import HeaderComponent from "../layout/HeaderComponent";
import FooterComponent from "../layout/FooterComponent";
import React from 'react';
import TimeLineFrom from "./timeLine/TimeLineFrom";
export default () => {
    const currentDate = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = days[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();
    const dateString = `${day}, ${date} ${month} ${year}`;
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    const firstName = userData ? userData.firstName : '';
    return (
        <div>
            <div className='row m-0 p-0 mainBgImg'>
                <div className='m-0 p-0 col-2'>
                    <SiderComponent />
                </div>
                <div className='me-0 p-0 col-10 border'>
                    <div className=''>
                        <HeaderComponent />
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center' style={{ maxHeight: 'auto' }}>
                        {userData?.job !== "HR" &&(
                            <div className="d-flex justify-content-center align-items-center flex-column">
                            <p className='mt-4'>{dateString}</p>
                            <h2>Hello, {firstName}</h2>
                        </div>
                        )}
                        <div className="container-fluid d-flex justify-content-center align-items-center mt-3">
                            <TimeLineFrom />
                        </div>
                    </div>
                    <div className=''>
                        <FooterComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}