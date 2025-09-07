import { useState, useEffect, React } from "react";
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
import { userAPI, quizAPI, attemptAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "./ThemeContext";

export const Profile = ({ userData: propUserData, dashboardStats, loading: propLoading, error: propError, refreshUserData }) => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [editable, seteditable] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show preview immediately
        setProfileImg(URL.createObjectURL(file));
        
        // Upload to backend
        const response = await userAPI.uploadAvatar(file);
        
        if (response.success) {
          // Update the profile image URL from backend
          // Check if it's a Cloudinary URL (full URL) or local path
          const avatarUrl = response.data.avatarUrl.startsWith('http') 
            ? response.data.avatarUrl 
            : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${response.data.avatarUrl}`;
          setProfileImg(avatarUrl);
          
          // Refresh dashboard data to update avatar across all components
          if (refreshUserData) {
            refreshUserData();
          }
        } else {
          console.error('Avatar upload failed:', response.message);
          setError('Failed to upload avatar. Please try again.');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setError('Failed to upload avatar. Please try again.');
      }
    }
  };

  const [userData, setUserData] = useState({
    name: propUserData?.name || "",
    joined: propUserData?.joined || "",
    email: propUserData?.email || "",
    number: propUserData?.number || "",
    password: propUserData?.password || "",
    quizCreated: dashboardStats?.quizzesCreated || 0,
    quiSubmited: dashboardStats?.quizzesAttempted || 0,
    averageScore: dashboardStats?.averageScore || 0,
    address: propUserData?.address || "",
    dob: propUserData?.dob || "",
    username: propUserData?.username || "",
  });

  // Update local state when props change
  useEffect(() => {
    if (propUserData) {
      setUserData({
        name: propUserData.name || "",
        joined: propUserData.joined || "",
        email: propUserData.email || "",
        number: propUserData.number || "",
        password: propUserData.password || "",
        quizCreated: dashboardStats?.quizzesCreated || 0,
        quiSubmited: dashboardStats?.quizzesAttempted || 0,
        averageScore: dashboardStats?.averageScore || 0,
        address: propUserData.address || "",
        dob: propUserData.dob || "",
        username: propUserData.username || "",
      });
      
      // Always update profile image state, even if null
      setProfileImg(propUserData.avatarUrl || null);
    }
  }, [propUserData, dashboardStats]);
  // Handle form submission for profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        fullName: userData.name,
        phone: userData.number,
        address: userData.address,
        dateOfBirth: userData.dob,
      };
      
      const response = await userAPI.updateProfile(profileData);
      if (response.success) {
        seteditable(false);
        
        // Refresh dashboard data to update profile across all components
        if (refreshUserData) {
          refreshUserData();
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (propLoading) {
    return (
      <div className="h-auto w-full flex flex-col content-center pt-20 px-5">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (propError) {
    return (
      <div className="h-auto w-full flex flex-col content-center pt-20 px-5">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600 dark:text-red-400">{propError}</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-auto w-full flex flex-col content-center pt-20 px-5">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-auto w-full flex flex-col content-center pt-20 px-5">
        <div className="flex flex-row justify-end items-center text-gray-600 dark:text-gray-300 py-2">
          <FontAwesomeIcon icon={faCalendarDays} />
          <p className="px-3">Joined {userData.joined}</p>
        </div>
        <div className="relative h-full grid px-2">
          <hr className="w-full border-1 border-gray-300 dark:border-gray-600 rounded-full mx-auto" />
          <div className="absolute p-2 w-fit bg-white dark:bg-gray-800 justify-self-center top-0 -translate-y-25 rounded-full group">
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
            <h2 className="font-semibold text-3xl pt-2 text-center text-gray-800 dark:text-white w-60">
              {userData.name}
            </h2>
            <h3 className="text-gray-600 dark:text-gray-300 text-sm text-center w-60">
              {userData.email}
            </h3>
          </div>
        </div>
        <div className="px-10 flex flex-row justify-around mb-2 border-b-2 pb-5 border-gray-200 dark:border-gray-600">
          <button className="p-4 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-xl rounded-2xl flex flex-row gap-x-5 items-center hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
            <FontAwesomeIcon icon={faPenFancy} />
            <p>Quizzes Created</p>
            <p>{userData.quizCreated}</p>
          </button>
          <button className="p-4 bg-green-600 dark:bg-green-500 text-white font-semibold text-xl rounded-2xl flex flex-row gap-x-5 items-center hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
            <FontAwesomeIcon icon={faStar} />
            <p>Average Score</p>
            <p>{userData.averageScore}%</p>
          </button>
          <button className="p-4 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-xl rounded-2xl flex flex-row gap-x-5 items-center hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
            <FontAwesomeIcon icon={faCircleCheck} />
            <p>Quizzes Submited</p>
            <p>{userData.quiSubmited}</p>
          </button>
        </div>
        <div className="p-2">
          <h2 className="text-gray-500 dark:text-gray-400">Account Details</h2>
          <form
            onSubmit={handleSubmit}
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
                    ? "bg-gray-100 dark:bg-gray-700 border-1 border-gray-300 dark:border-gray-600"
                    : "bg-gray-200 dark:bg-gray-600"
                } transition-colors duration-300`}
              >
                <label
                  htmlFor={field.id}
                  className="font-semibold justify-self-center text-gray-700 dark:text-gray-200"
                >
                  {field.label}
                </label>
                <input
                  className="p-5 w-full outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                className="px-4 py-2 bg-green-500 dark:bg-green-600 border-2 border-gray-300 dark:border-gray-600 text-white font-semibold cursor-pointer rounded-xl flex flex-row gap-x-5 items-center hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
            </div>
            <div className="w-full col-start-2 flex justify-end px-5">
              <button
                className={`px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 cursor-pointer rounded-xl flex-row gap-x-5 items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
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