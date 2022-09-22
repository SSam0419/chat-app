import React, { useEffect, useState } from "react";

const Clock = () => {
  const [timeString, setTimeString] = useState(" ");

  useEffect(() => {
    clock();
  }, []);

  function clock() {
    const now = new Date();
    var hrs = now.getHours();
    var mins = now.getMinutes();
    var secs = now.getSeconds();

    if (hrs < 10 || hrs == 0) {
      hrs = "0" + hrs.toString();
    }
    if (mins < 10 || mins == 0) {
      mins = "0" + mins.toString();
    }
    if (secs < 10 || secs == 0) {
      secs = "0" + secs.toString();
    }

    const timeNow = hrs + ":" + mins + ":" + secs;

    setTimeString(timeNow);
    setTimeout(clock, 1000);
  }

  return <div>{timeString}</div>;
};

export default Clock;
