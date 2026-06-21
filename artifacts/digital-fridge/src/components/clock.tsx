import { useState, useEffect } from "react";
import { format } from "date-fns";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-6xl font-bold tracking-tighter text-[#1C1C1E]">
        {format(time, "HH:mm")}
      </div>
      <div className="text-lg font-light text-gray-500 mt-1">
        {format(time, "MMMM d, EEE")}
      </div>
    </div>
  );
}
