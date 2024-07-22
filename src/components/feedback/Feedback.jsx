import React from 'react';
import FooterComponent from '../layout/FooterComponent';
import HeaderComponent from '../layout/HeaderComponent';
import SiderComponent from '../layout/SiderComponent';
import { Outlet } from 'react-router-dom';
import '../../styles/feedback.css';

const Feedback = () => {

  return (
    <div>
      <div className='row m-0 p-0'>
        <div className='m-0 p-0 col-2' style={{}} >
          <SiderComponent />
        </div>
        <div className=' me-0 p-0 col-10 '>
          <div className='' >
            <HeaderComponent />
          </div>
          <div className='' >
            <div className='pt-4 pe-4 ps-4 mainBgImg' style={{height:'650px'}}>
                <Outlet />
                {/* <Link to="request" >Request</Link> */}
              </div>
          </div>
          <div className=''>
            <FooterComponent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback