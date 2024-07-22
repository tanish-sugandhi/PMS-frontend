// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import SiderComponent from "../layout/SiderComponent";
// import HeaderComponent from "../layout/HeaderComponent";
// import FooterComponent from "../layout/FooterComponent";
// import UserService from "../../services/UserService";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Table } from "antd";
// const ViewTrackingData = () => {
//   const navigate = useNavigate();
//   const [viewDataById, setViewDataById] = useState([]);
//   const [managerData, setManagerData] = useState(null);
//   const [allEmployeeData,setAllEmployeeData]=useState(null);
//   const [error, setError] = useState(null);
//   const [viewData,setViewData]=useState([]);
//   const [yearlyRecord, setYearlyRecord] = useState([]);
//   const [page, setPage] = React.useState(1);
//   const token = JSON.parse(localStorage.getItem("token")).token;
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const managerId = currentUser?.managerId;
//   const userId = currentUser?.userId;

//      const checkManager=async()=>{
//       await UserService.getByEmployeesUnderMe(token, userId)
//       .then(response => {
//        const response1 = response;
//        console.log(response1.data?.body);
//        setViewData(response1?.data?.body);
//       })
//      }
//      useEffect(()=>{
//         checkManager();
//      },[])

//   useEffect(() => {
//     if (userId) {
//       getDataById(userId);
//     } else {
//       console.error("User ID is not present in localStorage");
//     }
//   }, [userId]);

//   const getDataById = async (userId) => {
//     try {
//       console.log(userId + " employee id");
//       const response = await axios.get(`http://localhost:8080/api/progress/get/user/${userId}`, {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       // console.log(response.data + " data by employee id");
//        // Add serial numbers
//        const dataWithSerialNumbers = response?.data?.map((item, index) => ({
//         ...item,
//         sno: index + 1,
//       }));
//       setViewDataById(dataWithSerialNumbers);
//     } catch (error) {
//       console.error("Error fetching data by user ID:", error);
//       setError(error);
//     }
//   };

//   useEffect(() => {
//     if (managerId) {
//       fetchManagerData(managerId);
//     } else {
//       console.error("Manager ID is not present in localStorage");
//     }
//   }, [userId]);

//   const fetchManagerData = async (managerId) => {
//     try {
//       console.log(managerId);
//       const response = await UserService.getUserById(token, managerId);
//       setManagerData(response.data);
//       console.log('Manager Name: ' + response.data.firstName + " " + response.data.lastName);
//     } catch (error) {
//       console.error("Error fetching manager data:", error);
//       setError(error);
//     }
//   };

//   // useEffect(()=>{
//   //    fetchEmployeeData();
//   // },[])
//   // const fetchEmployeeData=async()=>{
//   //   const response = await axios.get(`http://localhost:8080/api/progress/getAllTrackingData`, { headers: { "Authorization": `Bearer ${token.token}` } });
//   //   try{
//   //     console.log("getAllData "+response.data);
//   //   }
//   //   catch(error)
//   //   {
//   //     console.log(error)
//   //   }
//   // }
//   const openTab=(th)=>{
//     {
//       window.open(th?.name,'_blank');
//   }
//   }
//   const columns = [
//     {
//       title: 'S.No',
//       dataIndex: 'sno',
//       key: 'sno',
//     },
//     {
//       title: 'Manager Name',
//       dataIndex: 'managerName',
//       key: 'managerName',
//       render:(_, record)=>(
//         record ? `${managerData.firstName} ${managerData.lastName}` : "Loading..."
//       )
//     },
//     {
//       title: 'Title',
//       dataIndex: 'title',
//       key: 'title',
//     },
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: 'date',
//     },
//     {
//       title: 'Month',
//       dataIndex: 'month',
//       key: 'month',
//     },
//     {
//       title: 'Year',
//       dataIndex: 'year',
//       key: 'year',
//     },
//     {
//       title: 'Recording',
//       dataIndex: 'recording',
//       key: 'recording',
//       render: (_, record) => <a href={record?.recording} target="_blank" rel="noopener noreferrer">Recording</a>, // Example link
//     },
//     {
//       title: 'Notes',
//       dataIndex: 'notes',
//       key: 'notes',
//       render: (_, record) => <a href={record?.notes} target="_blank" rel="noopener noreferrer">Notes</a>, // Example link
//     },
//   ];
//   return (
//     <>
//       <div>
//         <div className='row m-0 p-0 mainBgImg'>
//           <div className='m-0 p-0 col-2'>
//             <SiderComponent />
//           </div>
//           <div className='me-0 p-0 col-10 border'>
//             <div className=''>
//               <HeaderComponent />
//             </div>
//             <div className='m-3 p-3'>
//               <h3>Progress Tracking</h3>
//               {error && <div className="alert alert-danger">Error: {error.message}</div>}

//               <div className="mt-4">
//                <Table columns={columns} dataSource={viewDataById} />
//               </div>
//             </div>
//             <div className=''>
//               <FooterComponent />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ViewTrackingData;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiderComponent from "../layout/SiderComponent";
import HeaderComponent from "../layout/HeaderComponent";
import FooterComponent from "../layout/FooterComponent";
import UserService from "../../services/UserService";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Tabs } from "antd";
const ViewTrackingData = () => {
  const navigate = useNavigate();
  const [viewDataById, setViewDataById] = useState([]);
  const [managerData, setManagerData] = useState(null);
  const [allEmployeeData, setAllEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [yearlyRecord, setYearlyRecord] = useState([]);
  const [page, setPage] = React.useState(1);
  const token = JSON.parse(localStorage.getItem("token")).token;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const managerId = currentUser?.managerId;
  const userId = currentUser?.userId;

  const checkManager = async () => {
    await UserService.getByEmployeesUnderMe(token, userId)
      .then(response => {
        const response1 = response;
        console.log(response1.data?.body);
        setViewData(response1?.data?.body);
      })
  }
  useEffect(() => {
    checkManager();
  }, [])

  useEffect(() => {
    if (userId) {
      getDataById(userId);
    } else {
      console.error("User ID is not present in localStorage");
    }
  }, [userId]);

  const getDataById = async (userId) => {
    try {
      console.log(userId + " employee id");
      const response = await axios.get(`http://localhost:8080/api/progress/get/user/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      // console.log(response.data + " data by employee id");
      // Add serial numbers
      const dataWithSerialNumbers = response?.data?.map((item, index) => ({
        ...item,
        //sno: index + 1,
      }));
      const years = response?.data?.map(item => (item?.year));
      const uniqueYearsSet = new Set(years);
      setYearlyRecord(Array.from(uniqueYearsSet));
      setViewDataById(dataWithSerialNumbers);
    } catch (error) {
      console.error("Error fetching data by user ID:", error);
      setError(error);
    }
  };

  useEffect(() => {
    if (managerId) {
      fetchManagerData(managerId);
    } else {
      console.error("Manager ID is not present in localStorage");
    }
  }, [userId]);

  const fetchManagerData = async (managerId) => {
    try {
      console.log(managerId);
      const response = await UserService.getUserById(token, managerId);
      setManagerData(response.data);
      console.log('Manager Name: ' + response.data.firstName + " " + response.data.lastName);
    } catch (error) {
      console.error("Error fetching manager data:", error);
      setError(error);
    }
  };

  const getFilteredDataByYear = (year) => {
    return viewDataById?.filter(progress => progress.year == year).map((item, index) => ({
      ...item,
      key: index + 1,
      sno: index + 1,

    }));
  }

  // useEffect(()=>{
  //    fetchEmployeeData();
  // },[])
  // const fetchEmployeeData=async()=>{
  //   const response = await axios.get(`http://localhost:8080/api/progress/getAllTrackingData`, { headers: { "Authorization": `Bearer ${token.token}` } });
  //   try{
  //     console.log("getAllData "+response.data);
  //   }
  //   catch(error)
  //   {
  //     console.log(error)
  //   }
  // }
  const openTab = (th) => {
    {
      window.open(th?.name, '_blank');
    }
  }
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Manager Name',
      dataIndex: 'managerName',
      key: 'managerName',
      render: (_, record) => (
        record ? `${managerData.firstName} ${managerData.lastName}` : "Loading..."
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Recording',
      dataIndex: 'recording',
      key: 'recording',
      render: (_, record) => <a href={record?.recording} target="_blank" rel="noopener noreferrer">Recording</a>, // Example link
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (_, record) => <a href={record?.notes} target="_blank" rel="noopener noreferrer">Notes</a>, // Example link
    },
  ];
  return (
    <>
      <div>
        <div className='row m-0 p-0 mainBgImg'>
          <div className='m-0 p-0 col-2'>
            <SiderComponent />
          </div>
          <div className='me-0 p-0 col-10 border'>
            <div className=''>
              <HeaderComponent />
            </div>
            <div className='m-3 p-3'>
              <h3>Progress Tracking</h3>
              {error && <div className="alert alert-danger">Error: {error.message}</div>}

              <div className='mt-2'>
                {viewDataById?.length == 0 ? <Table
                  columns={columns}
                  dataSource={null}
                  style={{ overflow: 'visible', width: '100%', fontSize: '16px' }}
                  scroll={{
                    y: 400,
                  }}
                  pagination={{
                    pageSize: 5
                  }}
                ></Table>
                  :
                  <Tabs
                    defaultActiveKey="0"
                    tabPosition={'top'}
                    style={{
                      height: 220,
                    }}
                    items={yearlyRecord?.map((year, i) => {
                      const id = String(i);
                      return {
                        label: `${year}`,
                        key: id,
                        disabled: i === 28,
                        children:
                          <Table
                            columns={columns}
                            dataSource={getFilteredDataByYear(year)}
                            style={{ overflow: 'visible', width: '100%', fontSize: '16px' }}
                            scroll={{
                              y: 400,
                            }}
                            pagination={{
                              current: page,
                              pageSize: 5,
                              onChange(current) {
                                setPage(current);
                              }
                            }}
                          ></Table>,
                      };
                    })}
                  />
                }
              </div>

            </div>
            <div className=''>
              <FooterComponent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewTrackingData;







