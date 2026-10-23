import { useState } from "react";

export const useOtpInput = (length: number = 6) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  return { otp, setOtp };
};
