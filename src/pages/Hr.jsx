import React from 'react';
import SiderComponent from '../components/layout/SiderComponent';
import HeaderComponent from '../components/layout/HeaderComponent';
import FooterComponent from '../components/layout/FooterComponent';
import ContentComponent from '../components/layout/MiddelComponent';

const Hr = () => {
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
   
    return (
        <div>
            <div className='row m-0 p-0'>
                <div className='m-0 p-0 col-2'>
                    <SiderComponent/>
                </div>
                <div className=' me-0 p-0 col-10 border'>
                    <div className=''>
                        <HeaderComponent />
                    </div>
                    <div className='mainBgImg' >
                        <ContentComponent />
                    </div>
                    <div className='bg-warning'>
                        <FooterComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hr;