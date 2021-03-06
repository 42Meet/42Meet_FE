import React, { useState } from 'react';
import TimePicker from './Timepicker';
import { TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from 'react-bootstrap';
import '../styles/ReservationForm.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const ReservationForm = ({
  userInput,
  setUserInput,
  memberArray,
  setMemberArray,
  reservedTime,
  openModal,
}) => {
  const [memberInput, setMemberInput] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && memberInput !== '') {
      setMemberArray([...memberArray, memberInput]);
      setMemberInput('');
    }
  };

  const handleChange = (e) => {
    setMemberInput(e.target.value);
  };

  const handleInputChange = (e) => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = (e) => {
    const i = parseInt(e.target.id);
    setMemberArray(memberArray.slice(0, i).concat(memberArray.slice(i + 1)));
  };

  const classes = useStyles();

  return (
    <div
      id="reservation-form-wrapper"
      className={classes.root}
      noValidate
      autoComplete="off"
    >
      <Typography align="center" className="typography">
        회의실 명: {userInput.location} - {userInput.roomName}
      </Typography>
      <div id="time-picker">
        <TimePicker
          name="startTime"
          userInput={userInput}
          setUserInput={setUserInput}
          reservedTime={reservedTime}
        ></TimePicker>
        <div>~</div>
        <TimePicker
          name="endTime"
          userInput={userInput}
          setUserInput={setUserInput}
          reservedTime={reservedTime}
        ></TimePicker>
      </div>
      <TextField
        label="소속"
        variant="outlined"
        size="small"
        name="department"
        value={userInput.department}
        onChange={handleInputChange}
        error={userInput.department ? false : true}
      />
      <TextField
        label="행사명"
        variant="outlined"
        size="small"
        name="title"
        value={userInput.title}
        onChange={handleInputChange}
        error={userInput.title ? false : true}
      />
      <TextField
        label="사용 목적"
        variant="outlined"
        size="small"
        name="purpose"
        value={userInput.purpose}
        onChange={handleInputChange}
        error={userInput.purpose ? false : true}
      />
      <TextField
        label="팀원을 입력해주세요"
        variant="outlined"
        size="small"
        name="purpose"
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        value={memberInput}
      />
      <Typography align="center" className="typography">
        팀원 수 : {memberArray.length}
      </Typography>
      {memberArray.map((member, idx) => {
        return (
          <div id={idx} key={idx} className="member">
            {member}
            <Button id={idx} variant="dark" onClick={handleClick}>
              &times;
            </Button>
          </div>
        );
      })}
      <Button
        variant="dark"
        disabled={
          userInput.roomName &&
          userInput.startTime &&
          userInput.endTime &&
          userInput.department &&
          userInput.purpose &&
          userInput.title
            ? false
            : true
        }
        onClick={openModal}
      >
        Reservation
      </Button>
    </div>
  );
};

export default ReservationForm;
