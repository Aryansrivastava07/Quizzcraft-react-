import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="grid-cols-subgrid content-center">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#333333] dark:text-white">
          User Login
        </h1>
        <form action="" method="post" className="w-[60%] place-self-center">
          <div className="h-full w-full flex flex-col text-black dark:text-black">
            {/* <label htmlFor="userId">User ID </label> */}
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
                placeholder="User ID"
              />
            </div>
            <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5 flex items-center">
              <FontAwesomeIcon icon={faLock} className="pr-3 text-[#1e3050]" />
              <input
                type="password"
                id="password"
                name="password"
                className="outline-none w-full"
                placeholder="Password"
              />
            </div>
            {/* <label htmlFor="password">Password </label> */}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 py-3 px-5 outline-none rounded-full my-5 text-white font-bold cursor-pointer"
          >
            LOGIN
          </button>
        </form>
        <div
          className="w-full mb-5"
          onClick={() => navigate("/auth/forgot-password")}
        >
          <p className="text-center text-sm text-[#333333c3] cursor-pointer hover:text-[#333333] dark:text-white dark:hover:text-[#9b9b9b]">
            Forgot UserID / Password
          </p>
        </div>
      </div>
      <div
        className="text-center cursor-pointer"
        onClick={() => navigate("/auth/register")}
      >
        Create a Account
        <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-sm" />
      </div>
    </>
  );
};
// export const Login = ()=>{
//     return (
//         <>
//          <h2>Login Component Loaded</h2>
//       {/* Your login form here */}
//         </>
//     )
// }
