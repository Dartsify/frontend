"use client";

import moment, { Moment } from "moment";
import { useEffect, useMemo, useState } from "react";

export default function Timer({
  time,
}: {
  time: Moment | Date | string | number;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000); // Update every second with new Date.now() to ensure accuracy

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const elapsedLabel = useMemo(() => {
    const baseTime = moment.isMoment(time)
      ? time.valueOf()
      : new Date(time).getTime(); // Base time is the given start date

    if (Number.isNaN(baseTime)) {
      return "00:00";
    }

    const elapsedSeconds = Math.max(0, Math.floor((now - baseTime) / 1000));
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [now, time]);

  return <p>{elapsedLabel}</p>;
}
