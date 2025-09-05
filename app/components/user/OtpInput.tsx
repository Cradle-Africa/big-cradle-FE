import React, { useRef } from 'react';

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (otp: string) => void;
}

const OtpInput: React.FC<OTPInputProps> = ({ length, value, onChange }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, ''); // Only allow digits
    const otpArray = value.split('');
    otpArray[index] = val.charAt(val.length - 1) || '';
    onChange(otpArray.join(''));

    if (val && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, ''); // digits only
    if (!pasted) return;

    const otp = pasted.slice(0, length); // trim to required length
    onChange(otp);

    // auto-fill each input box
    otp.split('').forEach((digit, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = digit;
      }
    });

    // move focus to the last filled input
    if (inputsRef.current[otp.length - 1]) {
      inputsRef.current[otp.length - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array(length).fill(0).map((_, index) => (
        <input
          key={index}
          ref={(el: HTMLInputElement | null) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined} // 👈 only first box listens for paste
          className="w-6 md:w-12 h-6 md:h-12 text-center border border-gray-300 rounded-sm text-sm md:text-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};

export default OtpInput;
