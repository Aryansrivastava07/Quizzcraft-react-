import { useState , React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faBell,
  faCalendarDays,
  faUserTie,
  faPenFancy,
  faCircleCheck,
  faStar,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { faIdBadge } from "@fortawesome/free-regular-svg-icons";
export const Profile = () => {
  const [editable, seteditable] = useState(false);
  const [profileImg, setProfileImg] = useState(null);

const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file));
    }
  };

  const [userData, setUserData] = useState({
    name: "Akshat Yadav",
    joined: "January 2025",
    email: "ashat.yadav2004@gmail.com",
    number: "8789798789",
    password: "teoiffo2",
    quizCreated: "20",
    quiSubmited: "10",
    averageScore: "82",
    address: "Kanpur",
    dob: "",
    username: "akshat_yadav",
  });
  return (
    <>
      <div className="h-auto w-full flex flex-col content-center pt-20 px-5">
        <div className=" flex flex-row justify-end items-center text-[#354960] py-2">
          <FontAwesomeIcon icon={faCalendarDays} />
          <p className="px-3">Joined {userData.joined}</p>
        </div>
        <div className="relative h-full  grid px-2">
          <hr className="w-full border-1 text-[#1e2939ad] rounded-full mx-auto" />
          <div className="absolute p-2 w-fit bg-white justify-self-center top-0 -translate-y-25 rounded-full group ">
            <div className="hoverelement absolute h-50 w-50 rounded-full place-items-center bg-[#0909097d] backdrop-opacity-5 hidden group-hover:grid z-10">
              <form action="" method="post" className="h-full w-full rounded-full grid place-items-center">
                <input
                  type="file"
                  name="profile"
                  id="profile"
                  accept="[images/*]"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="profile" className="w-full h-full cursor-pointer grid place-items-center">
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="text-white text-5xl cursor-pointer"
                  />
                </label>
              </form>
            </div>
            <div className="h-50 w-50 rounded-full grid place-items-center bg-gray-800 z-0 overflow-hidden">
              {profileImg && (
                <img
                  src={profileImg}
                  alt=""
                  className="rounded-full w-full h-full object-cover"
                />
              )}
              {!profileImg && (
                <FontAwesomeIcon
                  icon={faUserTie}
                  className=" text-9xl text-white"
                />
              )}
            </div>
          </div>
          <div className="mt-25 w-full flex flex-col justify-center items-center mb-5">
            <h2 className="font-semibold text-3xl pt-2 text-center text-[#1e2939] w-60">
              {userData.name}
            </h2>
            <h3 className="text-[#354960bd] text-sm text-center w-60">
              {userData.email}
            </h3>
          </div>
        </div>
        <div className="px-10 flex flex-row justify-around mb-2 border-b-2 pb-5 border-[#e5e7eb]">
          <button className="p-4 bg-[#6169f9] text-white font-semibold text-xl rounded-2xl flex flex-row gap-x-5 items-center ">
            <FontAwesomeIcon icon={faPenFancy} />
            <p>Quizzes Created</p>
            <p>{userData.quizCreated}</p>
          </button>
          <button className="p-4 bg-[#61f973] text-white font-semibold text-xl rounded-2xl flex flex-row gap-x-5 items-center">
            <FontAwesomeIcon icon={faStar} />
            <p>Average Score</p>
            <p>{userData.averageScore}%</p>
          </button>
          <button className="p-4 bg-[#6169f9] text-white font-semibold text-xl rounded-2xl flex flex-row gap-x-5 items-center ">
            <FontAwesomeIcon icon={faCircleCheck} />
            <p>Quizzes Submited</p>
            <p>{userData.quiSubmited}</p>
          </button>
        </div>
        <div className="p-2">
          <h2 className="text-[#979da9]">Account Details</h2>
          <form
            action=""
            className="grid grid-cols-2 place-items-center gap-5 p-2"
          >
            {[
              {
                label: "Name",
                type: "text",
                id: "name",
                name: "name",
                value: userData.name,
                colSpan: 1,
              },
              {
                label: "User Name",
                type: "text",
                id: "username",
                name: "username",
                value: userData.username,
                colSpan: 1,
              },
              {
                label: "Email",
                type: "email",
                id: "email",
                name: "email",
                value: userData.email,
                colSpan: 1,
              },
              {
                label: "DOB",
                type: "date",
                id: "DOB",
                name: "DOB",
                value: userData.dob,
                colSpan: 1,
              },
              {
                label: "Number",
                type: "number",
                id: "number",
                name: "number",
                value: userData.number,
                colSpan: 1,
              },
              {
                label: "Password",
                type: "password",
                id: "password",
                name: "password",
                value: userData.password,
                colSpan: 1,
              },
              {
                label: "Address",
                type: "text",
                id: "address",
                name: "address",
                value: userData.address,
                colSpan: 2,
              },
            ].map((field, idx) => (
              <div
                key={field.id}
                className={`w-full h-fit px-5 rounded-2xl grid grid-cols-[1fr_5fr] items-center${
                  field.colSpan === 2 ? " col-span-2 grid-cols-[1fr_10fr]" : ""
                }
                ${
                  editable
                    ? "bg-[#47464644] border-1 border-gray-700"
                    : "bg-[#dfdadac5]"
                }`}
              >
                <label
                  htmlFor={field.id}
                  className="font-semibold justify-self-center"
                >
                  {field.label}
                </label>
                <input
                  className="p-5 w-full outline-none"
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  value={field.value}
                  disabled={!editable}
                  onChange={(e) => {
                    setUserData((prev) => ({
                      ...prev,
                      [field.id]: e.target.value,
                    }));
                  }}
                />
              </div>
            ))}
            <div
              className={`w-full col-start-2 justify-end px-5 ${
                editable ? "flex" : "hidden"
              }`}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 border-2 border-gray-300 text-white font-semibold cursor-pointer rounded-xl flex flex-row gap-x-5 items-center  "
              >
                Submit
              </button>
            </div>
            <div className="w-full col-start-2 flex justify-end px-5">
              <button
                className={`px-4 py-2 border-2 border-gray-300 text-gray-600 cursor-pointer rounded-xl flex-row gap-x-5 items-center ${
                  !editable ? "flex" : "hidden"
                } `}
                type="button"
                onClick={() => {
                  seteditable(true);
                }}
              >
                Edit Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};