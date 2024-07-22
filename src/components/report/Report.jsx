import HeaderComponent from "../layout/HeaderComponent";
import SiderComponent from "../layout/SiderComponent";
import FooterComponent from "../layout/FooterComponent";
export default () => {
    return <>
        <div>
            <div className='row m-0 p-0 mainBgImg'>
                <div className='m-0 p-0 col-2'>
                    <SiderComponent />
                </div>
                <div className=' me-0 p-0 col-10 border'>
                    <div className=''>
                        <HeaderComponent />
                    </div>
                    <div className='p-5 mt-2 d-flex justify-content-center ' style={{height:'640px'}} >
                        <div className="d-flex p-3 reportComingSoon">
                            {/* <div className="bg-warning" style={{height:'30%',width:'50%'}}>
                                <h3>Goals</h3>
                            </div>
                            <div className="bg-primary" style={{height:'30%',width:'50%'}}>
                                <h3>Progress Tracking</h3>
                            </div>
                            <div className="bg-warning" style={{height:'30%',width:'50%'}}>
                                <h3>Feedback</h3>
                            </div> */}
                        </div>
                    </div>
                    <div className=''>
                        <FooterComponent />
                    </div>
                </div>
            </div>
        </div>
    </>
}
