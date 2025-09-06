import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OtpInput } from "./Otpverification";
import {SendOtp} from "./OtpSender";
import {
  faEnvelope,
  faLock,
  faArrowRight,
  faUser,
  faPhone,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { use } from "react";
export const Register = () => {
  const navigate = useNavigate();
  const [OtpVerified, setOtpVerified] = useState(false);
  const [Otp, setOtp] = useState(null);
  return (
    <>
      <div className="grid-cols-subgrid content-center">
        {!Otp && (
          <>
            <h1 className="text-4xl font-bold text-center mb-10 text-[#333333]">
              User Register
            </h1>
            <form action="" method="post" className="w-[60%] place-self-center">
              <div className="h-full w-full flex flex-col">
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="outline-none "
                    placeholder="Name"
                  />
                </div>
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="email"
                    id="userId"
                    name="userId"
                    className="outline-none "
                    placeholder="Email"
                  />
                </div>
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="number"
                    id="number"
                    name="number"
                    className="outline-none appearance-none"
                    placeholder="Number"
                  />
                </div>
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="password"
                    id="set=password"
                    name="set-password"
                    className="outline-none"
                    placeholder="Set Password"
                  />
                </div>
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faUnlock}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    className="outline-none"
                    placeholder="Confirm Password"
                  />
                </div>
                {/* <label htmlFor="password">Password </label> */}
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 py-3 px-5 outline-none rounded-full my-5 text-white font-bold cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if(ValidatePassword(document.getElementById("set-password").value,document.getElementById("confirm-password").value))
                    SendOtp(setOtp,document.getElementById("userId").value);
                  else {
                    alert("Recheck Password");
                    document.getElementById("set-password").value = "";
                    document.getElementById("confirm-password").value = "";
                  }
                }}
              >
                REGISTER
              </button>
            </form>
          </>
        )}
        {Otp && !OtpVerified && (
          <OtpInput CorrectOtp={Otp} setotpVerified={setOtpVerified} />
        )}
        {Otp && OtpVerified && <Navigate to="/auth/login" />}
      </div>
      {!Otp && (
        <div
          className="text-center cursor-pointer"
          onClick={() => navigate("/auth/login")}
        >
          Already a User
          <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-sm" />
        </div>
      )}
    </>
  );
};
function ValidatePassword(password,confirmPassword) {
  if(password.length < 8) return false;
  if(password === confirmPassword) return true;
  else return false;
}