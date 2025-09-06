import { useRef, useState, useEffect } from "react";

export const OtpInput = ({ length = 6,CorrectOtp, setotpVerified }) => {
  const [userInput, setUserInput] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);
  const [verified,setVerified] = useState(false);
  const [otpsubmit,setotpsubmit] = useState(false);


  const handleChange = (value, index) => {
    setotpsubmit(false);
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...userInput];
    newOtp[index] = value;
    setUserInput(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !userInput[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setUserInput(newOtp);

    newOtp.forEach((digit, i) => {
      inputsRef.current[i].value = digit;
    });

    inputsRef.current[length - 1].focus();
  };
  const [Timer, setTimer] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(interval);
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [userInput]);

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-10 text-[#333333]">
        Verify OTP
      </h1>
      <p className="text-center text-sm text-[#333333] mb-10 ">
        Enter the OTP sent to your email address.{" "}
      </p>
      <form action="" method="post" className="w-[60%] place-self-center">
        <div className="flex gap-2 justify-center otpinput" onPaste={handlePaste}>
          {userInput.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className={`w-12 h-12 text-center text-xl border rounded focus:outline-none focus:ring-2 transition-all duration-200 
                ${otpsubmit ? (verified ? "bg-green-500 border-green-300 ": "bg-red-500 border-red-300") : "bg-gray-200 border-gray-600 "}`}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              autoComplete="off"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 py-3 px-5 outline-none rounded-full my-5 text-white font-bold cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setotpsubmit(true);
            if(ValidateOtp(userInput,CorrectOtp)) {
                setVerified(true);
                setTimeout((()=>{
                setotpVerified(true);
            }), 500)
            }
            else setVerified(false);
          }}
        >
          Verify OTP
        </button>
        {Timer > 0 && (
          <p className="text-center text-sm text-[#333333c3] cursor-pointer hover:text-[#333333] pointer-events-none">
            Resend OTP in {Timer} seconds
          </p>
        )}
        {Timer === 0 && (
          <p className="text-center text-sm text-[#333333c3] cursor-pointer hover:text-[#333333] font-bold">
            Resend OTP 
          </p>
        )}
      </form>
    </>
  );
};
function ValidateOtp(userInput,CorrectOtp){
    let userinput = "";
    userInput.map((val)=>{
        userinput += val;
    })
    if(userinput === CorrectOtp) return true;
    return false;
}