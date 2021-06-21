import React from 'react';
import { getHoursArray } from '../utils/utils';

const TimePicker = ({ name, reservedTime, userInput, setUserInput }) => {
  const timeArray = getHoursArray();
  const { selectedRoom } = userInput;

  const handleChange = (e) => {
    let selectedTime = e.target.value;
    if (name === 'startTime') {
      setUserInput({
        ...userInput,
        startTime: selectedTime.slice(0, selectedTime.length - 2),
      });
    }
  };

  return (
    <div>
      <select
        onChange={handleChange}
        disabled={selectedRoom === '' ? true : false}
      >
        {timeArray.map((time, idx) => {
          return (
            <option
              key={idx}
              disabled={
                reservedTime[selectedRoom] !== undefined &&
                reservedTime[selectedRoom].indexOf(time) !== -1
                  ? true
                  : false
              }
            >
              {time < 12 ? `${time}AM` : `${time}PM`}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default TimePicker;