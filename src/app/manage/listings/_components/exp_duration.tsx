import { Duration, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

function durationToString(duration: Duration): string {
  const { years, months, weeks, days, hours, minutes, seconds } = duration;
  return years ? `${years} năm` : months ? `${months} tháng` : weeks ? `${weeks} tuần` : days ? `${days} ngày ` : hours ? `${hours} giờ ` : minutes ? `${minutes} phút ` : seconds ? `${seconds} giây ` : "";
}

export default function ExpDuration({ 
  className,
  exp,
} : { 
  className?: string;
  exp: Date;
}) {
  // console.log('exp', exp);
  const [expDuration, setExpDuration] = useState(intervalToDuration({
    start: new Date(),
    end: exp > new Date() ? exp : new Date(),
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (new Date().getTime() >= exp.getTime()) {
        return;
      }
      setExpDuration(intervalToDuration({
        start: now,
        end: exp > new Date() ? exp : new Date(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (exp > new Date()) ? (
    <span className={`text-sm text-center font-light ${className}`}>{durationToString(expDuration)}</span>
  ) : (
    <h5>Hết hạn</h5>
  );
}
