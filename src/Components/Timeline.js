import React from 'react';
import { getHoursArray, getUserName } from '../utils/utils';
import { Table } from 'react-bootstrap';
import '../styles/Timeline.css';

const Timeline = ({
  userInput,
  setUserInput,
  location,
  meetingRooms,
  reservedTime,
}) => {
  const timeArray = getHoursArray();

  const handleClick = (e) => {
    if (getUserName() === '') {
      if (window.confirm('로그인을 하시겠습니까?')) {
        window.location.href = 'http://42meet.kro.kr/login';
      }
    }
    setUserInput({
      ...userInput,
      roomName: e.target.innerText,
      location: location,
      startTime: null,
      endTime: null,
    });
  };

  return (
    <div id="timeline-wrapper">
      <Table responsive size="sm" variant="dark" bordered hover>
        <thead>
          <tr>
            <th className="table-h1">{location}</th>
            {Array.from({ length: 24 }).map((_, index) => (
              <th key={index} className="table-h2">
                {index}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meetingRooms.map((meetingRoom, idx) => {
            return (
              <tr key={idx}>
                <td onClick={handleClick} className="table-h1">
                  {meetingRoom}
                </td>
                {timeArray.map((time, idx) => {
                  return (
                    <td
                      key={idx}
                      className={
                        reservedTime === undefined ||
                        reservedTime[meetingRoom].indexOf(time) !== -1
                          ? ''
                          : 'empty'
                      }
                    ></td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Timeline;
