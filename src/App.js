import './App.css';
import GoalComponent from './components/goals/GoalComponent';
import Home from './pages/Home.jsx';
import Hr from './pages/Hr.jsx';
import LoginPage from './pages/LoginPage';
import Admin from './pages/Admin';
import UpdateForm from './components/user/UpdateForm.jsx';
import Add from './components/user/Add.jsx';
import { Route, Routes } from "react-router-dom";
import ViewProgressTracking from './components/progressTracking/ViewProgressTracking.jsx';
import AddTrackingData from './components/progressTracking/AddTrackingData';
import UpdateTracking from './components/progressTracking/UpdateTracking.jsx';
import UserProfile from './components/admin/UserProfile.jsx';
import ForgotPassword from './components/admin/ForgotPassword.jsx';
import TimeLine from './components/admin/TimeLine.jsx';
import PrivateRoute from './components/redux/PrivateRoute.js';
import Feedback from './components/feedback/Feedback.jsx';
import ProvideFeedback from './components/feedback/ProvideFeedback.jsx';
import RequestFeedback from './components/feedback/RequestFeedback.jsx';
import FeedbackDash from './components/feedback/FeedbackDash.jsx';
import EmployeeList from './components/manager/EmployeeList.jsx';
import SelfFeedback from './components/feedback/SelfFeedback.jsx';
import ManagerFeedback from './components/feedback/ManagerFeedback.jsx';
import PeerFeedback from './components/feedback/PeerFeedback.jsx';
import Report from './components/report/Report.jsx';
import ViewMoreDetail from './components/manager/ViewMoreDetail.jsx';

function App() {
  return (
    <>
      {/* <Router> */}
      <Routes>
        <Route path='/hrpage' element={<PrivateRoute><Hr/></PrivateRoute>}/>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/forgotPassword" element={
          <ForgotPassword />
        } />
        <Route path="/timeline" element={
          <PrivateRoute>
            <TimeLine />
          </PrivateRoute>
        } />
        <Route path="/myProfile" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />
        <Route path="/goals" element={
          <PrivateRoute>
            <GoalComponent />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="/update" element={
          <PrivateRoute>
            <UpdateForm />
          </PrivateRoute>
        } />
        <Route path="/create" element={
          <PrivateRoute>
            <Add />
          </PrivateRoute>
        } />
        <Route path="/api/progress/getAllTrackingData" element={
          <PrivateRoute>
            <ViewProgressTracking />
          </PrivateRoute>
        } />
        <Route path="/addProgress/:empId" element={
          <PrivateRoute>
            <AddTrackingData />
          </PrivateRoute>
        } />

        <Route path="/api/progress/updateData/:meetingId" element={
          <PrivateRoute>
            <UpdateTracking />
          </PrivateRoute>
        } />
        <Route path="/employeeList" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
        <Route path="/viewMoreDetail" element={<PrivateRoute><ViewMoreDetail /></PrivateRoute>}></Route>
        <Route path="/feedback" element={
          <PrivateRoute>
            <Feedback />
          </PrivateRoute>
        }>
          <Route path={'/feedback'} element={<FeedbackDash />} />
          <Route path={`self`} element={<SelfFeedback />} />
          <Route path={`peer`} element={<PeerFeedback />} />
          <Route path={`manager`} element={<ManagerFeedback />} />
          <Route path={`provide`} element={<ProvideFeedback />} />
          <Route path={`request`} element={<RequestFeedback />} />
        </Route>
        <Route path="/report" element={<Report/>}></Route>
      </Routes >
    </>
  );
}

export default App;
