"use client";

import { useRef } from "react";

type OtpInputProps = {
  onChangeCode?: (code: string) => void;
  otp: string[];
  setOtp: (otp: string[]) => void;
};

export function OtpInput({ onChangeCode, otp, setOtp }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const length = otp.length;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    // allow only one digit
    if (!value.match(/^\d?$/)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const code = newOtp.join("");
    onChangeCode?.(code);

    // focus next input if a digit is entered
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, ""); // keep only digits
    const newOtp = [...otp];

    for (let i = 0; i < Math.min(pasted.length, length); i++) {
      newOtp[i] = pasted[i];
    }

    setOtp(newOtp);
    const code = newOtp.join("");
    onChangeCode?.(code);

    // focus on the last filled input or the end
    const lastIndex = Math.min(pasted.length - 1, length - 1);
    inputsRef.current[lastIndex]?.focus();
  };

  return (
    <div className="flex items-center gap-2 md:gap-4" onPaste={handlePaste}>
      {otp.map((value, index) => (
        <span key={`otp-item-${index}`} className="contents">
          <input
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            className={`w-8 md:w-10 h-10.5 md:h-13 text-center font-bold md:font-medium text-sm md:text-lg ${value ? "bg-foreground-light-soft" : ""} border-2`}
          />
          {index == 2 && <span className="mx-2 font-bold">-</span>}
        </span>
      ))}
    </div>
  );
}
