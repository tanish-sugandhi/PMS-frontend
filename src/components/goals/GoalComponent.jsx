import React from 'react'
import DisplayGoals from './DisplayGoals';
import SiderComponent from '../layout/SiderComponent';
import HeaderComponent from '../layout/HeaderComponent';
import FooterComponent from '../layout/FooterComponent';
const GoalComponent = () => {
  return (
    <div>
      <div className='row m-0 p-0 mainBgImg'>
        <div className='m-0 p-0 col-2' >
          <SiderComponent />
        </div>
        <div className=' me-0 p-0 col-10 '>
          <div className='' >
            <HeaderComponent />
          </div>
          <div className='m-4' >
            <div>
              <div><DisplayGoals/></div>
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

export default GoalComponent