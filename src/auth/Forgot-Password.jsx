import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OtpInput } from "./Otpverification";
import { SendOtp } from "./OtpSender";
import {
  faEnvelope,
  faLock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export const ForgotPassword = () => {
  const [OtpVerified, setOtpVerified] = useState(false);
  const [Otp, setOtp] = useState(null);
  return (
    <>
      <div className="grid-cols-subgrid content-center">
        {!Otp && (
          <>
            <h1 className="text-4xl font-bold text-center mb-10 text-[#333333]">
              Recover Password
            </h1>
            <form action="" method="post" className="w-[60%] place-self-center">
              <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5 flex items-center">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="pr-3 text-[#1e3050]"
                />
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  className="outline-none w-full"
                  placeholder="Email Id"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 py-3 px-5 outline-none rounded-full my-5 text-white font-bold cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  SendOtp(setOtp, document.getElementById("userId").value);
                }}
              >
                Send OTP
              </button>
            </form>
          </>
        )}
        {Otp && !OtpVerified && (
          <OtpInput CorrectOtp={Otp} setotpVerified={setOtpVerified} />
        )}
        {Otp && OtpVerified && <ResetPassword />}
      </div>
      {!Otp && (
        <div className="text-center cursor-pointer">
          <Link to="/auth/login" className="">
            Back to Login
          </Link>
          <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-sm" />
        </div>
      )}
    </>
  );
};

const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-10 text-[#333333]">
        Reset Your Password
      </h1>
      <form action="" method="post" className="w-[60%] place-self-center">
        <div className="h-full w-full flex flex-col">
          <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5 flex items-center">
            <FontAwesomeIcon icon={faLock} className="pr-3 text-[#1e3050]" />
            <input
              type="password"
              id="password"
              name="password"
              className="outline-none w-full"
              placeholder="Set Password"
            />
          </div>
          <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5 flex items-center">
            <FontAwesomeIcon icon={faLock} className="pr-3 text-[#1e3050]" />
            <input
              type="password"
              id="confirm-password"
              name="confrim-password"
              className="outline-none w-full"
              placeholder="Confirm Password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 py-3 px-5 outline-none rounded-full my-5 text-white font-bold cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            if (
              ValidatePassword(
                document.getElementById("password").value,
                document.getElementById("confirm-password").value
              )
            ) {
              navigate("/auth/login");
            } else {
              alert("Recheck Password");
              document.getElementById("set-password").value = "";
              document.getElementById("confirm-password").value = "";
            }
          }}
        >
          Update Password
        </button>
      </form>
    </>
  );
};
function ValidatePassword(password, confirmPassword) {
  if (password.length < 8) return false;
  if (password === confirmPassword) return true;
  else return false;
}
