import React, { useState } from 'react';
import './Modal.css';

const Modal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header, userInput, members } = props;
  const [validate, setValidate] = useState(true);
  const submit = () => {
    //axios
    if (validate === true) {
      window.location.href = '/meeting/mypage';
    } else {
      close();
    }
  };
  const {
    selectedDate,
    selectedRoom,
    startTime,
    endTime,
    department,
    title,
    purpose,
  } = userInput;

  const infos = [
    '예약 날짜',
    '예약 장소',
    '예약 시간',
    '소속',
    '행사명',
    '사용목적',
    '팀원',
  ];
  const values = {
    [infos[0]]: selectedDate,
    [infos[1]]: selectedRoom,
    [infos[2]]: startTime + '시 ~ ' + endTime + '시',
    [infos[3]]: department,
    [infos[4]]: title,
    [infos[5]]: purpose,
    [infos[6]]: members ? (
      <ul>
        {members.map((member, idx) => {
          return <li key={idx}>{member}</li>;
        })}
      </ul>
    ) : (
      '없음'
    ),
  };

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>
            <div>
              {infos.map((text, idx) => {
                return (
                  <div key={idx}>
                    <div>{text}</div>
                    <div>{values[text]}</div>
                  </div>
                );
              })}
            </div>
          </main>
          <footer>
            <button className="submit" onClick={submit}>
              submit
            </button>
            <button className="close" onClick={close}>
              close
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default Modal;