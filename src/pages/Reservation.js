import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timeline from '../Components/Timeline';
import ReservationForm from '../Components/ReservationForm';
import Navigation from '../Components/Navigation';
import {
  range,
  getAFewDaysLater,
  getCookieValue,
  getHeaders,
} from '../utils/utils';
import Modal from '../Components/Modal';
import '../styles/Reservation.css';

// eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjQyNzk0NjYsImV4cCI6MTYyNjg3MTQ2Niwic3ViIjoiZXNpbSJ9.RaaFIFUN8Iqs26XioCiAjRDSQUgeqBK_wrYnckZSUOU

const Reservation = () => {
  const minDate = getAFewDaysLater(7).toISOString().substring(0, 10);
  const maxDate = getAFewDaysLater(20).toISOString().substring(0, 10);

  const [locations, setLocations] = useState([]);
  const [alreadyReservations, setAlreadyReservations] = useState([]);
  const [reservedTime, setReservedTime] = useState([]);
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
  const [modalOpen, setModalOpen] = useState(false);
  const [memberArray, setMemberArray] = useState([]);

  const initRooms = async () => {
    try {
      const rooms_res = await axios.get('http://15.164.85.227:8081/rooms', {
        headers: getHeaders(),
      });
      setLocations(rooms_res.data);
      try {
        const reservation_res = await axios.get(
          `http://15.164.85.227:8081/list?date=${userInput.selectedDate}`,
          { headers: getHeaders() }
        );
        setAlreadyReservations(reservation_res.data);
        let access_token = reservation_res.headers['access-token'];
        let refresh_token = reservation_res.headers['refresh-token'];
        if (access_token) {
          localStorage.setItem('access-token', access_token);
          localStorage.setItem('refresh-token', refresh_token);
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = async (e) => {
    const selectedDate = e.target.value;
    try {
      const response = await axios.get(
        `http://15.164.85.227:8081/list?date=${selectedDate}`,
        { headers: getHeaders() }
      );
      setAlreadyReservations(response.data);
      setUserInput({
        ...userInput,
        selectedDate: selectedDate,
        selectedLocation: '',
        selectedRoom: '',
        startTime: null,
        endTime: null,
      });
      let access_token = response.headers['access-token'];
      let refresh_token = response.headers['refresh-token'];
      if (access_token) {
        localStorage.setItem('access-token', access_token);
        localStorage.setItem('refresh-token', refresh_token);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const getReservedTime = (data) => {
      const temp = {};
      locations.forEach((table) => {
        let obj = {};
        for (let i = 0; i < table.roomName.length; i++) {
          obj[table.roomName[i]] = [];
        }
        for (let i = 0; i < data.length; i++) {
          const { location, roomName, startTime, endTime } = data[i];
          if (table.location === location)
            obj[roomName] = obj[roomName].concat(
              range(
                parseInt(startTime.slice(0, 2)),
                parseInt(endTime.slice(0, 2)) + 1
              )
            );
        }
        temp[table.location] = obj;
      });
      setReservedTime(temp);
    };
    getReservedTime(alreadyReservations);
  }, [locations, alreadyReservations]);

  useEffect(() => {
    let access_token = getCookieValue('access-token');
    let refresh_token = getCookieValue('refresh-token');

    if (access_token && refresh_token) {
      localStorage.setItem('access-token', access_token);
      localStorage.setItem('refresh-token', refresh_token);
      document.cookie = 'access-token=; path=/; max-age=0';
      document.cookie = 'refresh-token=; path=/; max-age=0';
    } else if (
      !localStorage.getItem('access-token') ||
      !localStorage.getItem('refresh-token')
    ) {
      localStorage.clear();
      window.location.href = '/meeting';
    }
    initRooms();
    // console.log('token', jwtDecode(getCookieValue('access_token')).sub);
  }, []);

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
          {locations.map((location, idx) => {
            return (
              <Timeline
                key={idx}
                userInput={userInput}
                setUserInput={setUserInput}
                location={location.location}
                meetingRooms={location.roomName}
                reservedTime={reservedTime[location.location]}
              />
            );
          })}
          <ReservationForm
            userInput={userInput}
            setUserInput={setUserInput}
            memberArray={memberArray}
            setMemberArray={setMemberArray}
            reservedTime={reservedTime[userInput.selectedLocation]}
            openModal={openModal}
          />
          <Modal
            open={modalOpen}
            close={closeModal}
            header="Modal heading"
            userInput={userInput}
            members={memberArray}
          ></Modal>
        </div>
      </div>
    </>
  );
};

export default Reservation;
