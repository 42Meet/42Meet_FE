import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timeline from '../Components/Timeline';
import ReservationForm from '../Components/ReservationForm';
import Navigation from '../Components/Navigation';
import { range, getAFewDaysLater, getCookieValue } from '../utils/utils';
import Modal from '../Components/Modal/Modal';
import jwtDecode from 'jwt-decode';
import '../styles/Reservation.css';

const Reservation = () => {
  const minDate = getAFewDaysLater(7).toISOString().substring(0, 10);
  const maxDate = getAFewDaysLater(20).toISOString().substring(0, 10);

  // const [rooms, setRooms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [alreadyReservations, setAlreadyReservations] = useState([]);

  const [userInput, setUserInput] = useState({
    selectedDate: minDate,
    selectedLocation: '',
    selectedRoom: '',
    startTime: null,
    endTime: null,
    department: '',
    title: '',
    purpose: '',
  });

  const getRooms = async () => {
    try {
      const locations_res = await axios.get('http://15.164.85.227:8081/rooms');
      setLocations(locations_res.data);
      try {
        const reservations_res = getAlreadyReservations(userInput.selectedDate);
        setAlreadyReservations(getReservedTime(reservations_res.data));
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getReservedTime = (data) => {
    const temp = {};
    locations.map((table) => {
      let obj = {};
      for (let i = 0; i < table.roomName.length; i++) {
        obj[table.roomName[i]] = [];
      }
      for (let i = 0; i < data.length; i++) {
        const { location, roomName, start_time, end_time } = data[i];
        if (table.location === location)
          obj[roomName] = obj[roomName].concat(
            range(
              parseInt(start_time.slice(0, 2)),
              parseInt(end_time.slice(0, 2))
            )
          );
      }
      temp[table.location] = obj;
    });
    return temp;
  };

  const getAlreadyReservations = async (date) => {
    try {
      const response = await axios.get(
        `http://15.164.85.227:8081/list?date=${date}`
      );
      getReservedTime(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = (e) => {
    setUserInput({ ...userInput, selectedDate: e.target.value });
    getAlreadyReservations(e.target.value);
  };

  useEffect(() => {
    getRooms();
  }, []);

  console.log(locations);

  return (
    <>
      <div>
        <Navigation />
        <div>
          <div id="datepicker-wrapper">
            <input
              type="date"
              onChange={onChange}
              value={userInput.selectedDate}
              min={minDate}
              max={maxDate}
            ></input>
          </div>
          {/* {locations.roomName.map((room) => {
            console.log(locations);
            return (
              <>
                <Timeline
                  userInput={userInput}
                  setUserInput={setUserInput}
                  location={room.location}
                  meetingRooms={room.roomName}
                  reservedTime={alreadyReservations[room.location]}
                />
              </>
            );
          })} */}
          {/* {Object.keys(reservedTime).length !== 0 ? (
          <ReservationForm
            userInput={userInput}
            setUserInput={setUserInput}
            memberArray={memberArray}
            setMemberArray={setMemberArray}
            reservedTime={reservedTime[userInput.selectedLocation]}
            openModal={openModal}
          /> */}
          {/* ) : (
          <></>
        )} */}
          {/* <Modal
          open={modalOpen}
          close={closeModal}
          header="Modal heading"
          userInput={userInput}
          members={memberArray}
        ></Modal> */}
        </div>
      </div>
    </>
  );
};

export default Reservation;
// const Reservation = () => {

//   const minDate = getAFewDaysLater(7).toISOString().substring(0, 10);
//   const maxDate = getAFewDaysLater(20).toISOString().substring(0, 10);
//   const locationTable = [
//     {
//       location: '개포',
//       roomName: ['경복궁', '창경궁', '덕수궁'],
//     },
//     {
//       location: '서초',
//       roomName: ['7클', '9클'],
//     },
//   ];

//   const [userInput, setUserInput] = useState({
//     selectedDate: minDate,
//     selectedLocation: '',
//     selectedRoom: '',
//     startTime: null,
//     endTime: null,
//     department: '',
//     title: '',
//     purpose: '',
//   });
//   const [reservationDatas, setReservationDatas] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [reservedTime, setReservedTime] = useState({});
//   const [memberArray, setMemberArray] = useState([]);

//   const getReservedTime = (jsonArray) => {
//     const temp = {};
//     locationTable.map((table) => {
//       let obj = {};
//       for (let i = 0; i < table.roomName.length; i++) {
//         obj[table.roomName[i]] = [];
//       }
//       for (let i = 0; i < jsonArray.length; i++) {
//         const { location, roomName, start_time, end_time } = jsonArray[i];
//         if (table.location === location)
//           obj[roomName] = obj[roomName].concat(
//             range(parseInt(start_time), parseInt(end_time))
//           );
//       }
//       temp[table.location] = obj;
//     });
//     setReservedTime(temp);
//   };

//   const getReservedInfo = async (newDate) => {
//     try {
//       // const response = await axios.get('/reservation', {
//       //   headers: {
//       //     Authorization: `Bearer ${localStorage.get('m_auth')}`,
//       //     date: newDate
//       //   }
//       // });
//       // const jsonArray = jsonToArray(response);
//       const response = [
//         {
//           location: '개포',
//           roomName: '경복궁',
//           start_time: '1',
//           end_time: '5',
//         },
//         {
//           location: '개포',
//           roomName: '창경궁',
//           start_time: '2',
//           end_time: '3',
//         },
//         {
//           location: '개포',
//           roomName: '덕수궁',
//           start_time: '5',
//           end_time: '10',
//         },
//       ];
//       // setReservationDatas(jsonArray);
//       // getReservedTime(jsonArray);
//       setReservationDatas(response);
//       getReservedTime(response);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const onChange = (e) => {
//     setUserInput({ ...userInput, selectedDate: e.target.value });
//     getReservedInfo();
//   };

//   useEffect(() => {
//     getReservedInfo(userInput.selectedDate);
//   }, [userInput.selectedDate]);

//   useEffect(() => {
//     // if (getCookieValue('access_token') === '') {
//     //   window.location.href = '/meeting';
//     // } else {
//     //   console.log(jwtDecode(getCookieValue('access_token')));
//     // }
//     if (getCookieValue('access_token') !== '')
//       console.log(jwtDecode(getCookieValue('access_token')));
//   }, []);

//   const openModal = () => {
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   const { selectedDate } = userInput;
//   return (
//     <div>
//       <Navigation />
//       <div>
//         <div id="datepicker-wrapper">
//           <input
//             type="date"
//             onChange={onChange}
//             value={selectedDate}
//             min={minDate}
//             max={maxDate}
//           ></input>
//         </div>
//         {Object.keys(reservedTime).length !== 0 &&
//           locationTable.map((table) => {
//             return (
//               <Timeline
//                 userInput={userInput}
//                 setUserInput={setUserInput}
//                 location={table.location}
//                 meetingRooms={table.roomName}
//                 reservedTime={reservedTime[table.location]}
//               />
//             );
//           })}
//         {Object.keys(reservedTime).length !== 0 ? (
//           <ReservationForm
//             userInput={userInput}
//             setUserInput={setUserInput}
//             memberArray={memberArray}
//             setMemberArray={setMemberArray}
//             reservedTime={reservedTime[userInput.selectedLocation]}
//             openModal={openModal}
//           />
//         ) : (
//           <></>
//         )}
//         <Modal
//           open={modalOpen}
//           close={closeModal}
//           header="Modal heading"
//           userInput={userInput}
//           members={memberArray}
//         ></Modal>
//       </div>
//     </div>
//   );
// };

// export default Reservation;
//
