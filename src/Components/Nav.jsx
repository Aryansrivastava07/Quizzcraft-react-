// 📁 Nav.js
import { React, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "./ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { faMoon, faSun, faUser, faSignOutAlt, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../utils/api";

const TogledarkMode = (darkMode) => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", darkMode ? "dark" : "light");
};

export const Nav = ({ children }) => {
  const { darkMode, setDarkMode } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  // Fetch user avatar when component mounts or user changes
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (isLoggedIn && user) {
        try {
          const avatarResponse = await userAPI.getAvatar();
          if (avatarResponse.success && avatarResponse.data) {
            // Check for avatarUrl first, then fallback to profilePicture
            const rawAvatarUrl = avatarResponse.data.avatarUrl || avatarResponse.data.profilePicture;
            
            if (rawAvatarUrl) {
              const processedUrl = rawAvatarUrl.startsWith('http') 
                ? rawAvatarUrl 
                : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${rawAvatarUrl}`;
              setUserAvatar(processedUrl);
            } else {
              setUserAvatar(null);
            }
          } else {
            setUserAvatar(null);
          }
        } catch (error) {
          setUserAvatar(null);
        }
      } else {
        setUserAvatar(null);
      }
    };

    fetchUserAvatar();
  }, [isLoggedIn, user]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
    setShowDropdown(false);
  };

  return (
    <nav className="h-[10vh] fixed top-0 w-screen z-10 flex items-center justify-between pl-8 pr-8 backdrop-blur-2xl border-b-2 border-gray-200 bg-[#ffffffb2] backdrop:blur-md dark:bg-[#0f1726] dark:border-gray-800 transition-colors duration-500">
      <div className="flex items-center gap-5 text-gray-900 dark:text-white">
        <img
          src="/logo2.png"
          alt="logo"
          className="w-18"
          height="500"
          width="500"
          onClick={() => navigate("/")}
        />
        <div className="relative w-12 h-8 rounded-full p-1 bg-gray-200 dark:bg-gray-700 transition-all duration-300 ease-in-out cursor-pointer" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset " }}
        onClick={() => {
              setDarkMode(!darkMode);
              TogledarkMode(!darkMode);
            }}>
          
          <div
            className="toggle absolute top-1/2 -left-0 h-9 w-9 rounded-full bg-gray-600 dark:bg-[#242c3c] -translate-y-1/2 -translate-x-3 dark:translate-x-5 rotate-0 dark:rotate-720 transition-all duration-300 grid place-items-center"
            style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset" }}
          >
            {darkMode ? (
              <FontAwesomeIcon icon={faMoon} className="text-white" />
            ) : (
              <FontAwesomeIcon icon={faSun} className="text-amber-300" />
            )}
          </div>
        </div>
      </div>
      <menu className="relative flex items-center justify-between flex-wrap">
        {children}
        {isLoggedIn ? (
          <div className="relative ml-4">
            <div 
              className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
              onMouseEnter={() => setShowDropdown(true)}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-indigo-200 dark:border-indigo-400 object-cover"
                  onError={(e) => {
                    console.log('Navbar - Image failed to load:', userAvatar);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-8 h-8 rounded-full border-2 border-indigo-200 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center ${userAvatar ? 'hidden' : 'flex'}`}
              >
                <FontAwesomeIcon 
                  icon={faUserTie} 
                  className="text-white text-sm"
                />
              </div>
            </div>
            
            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20"
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/Dashboard');
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Dashboard
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-600" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </menu>
    </nav>
  );
};

export function anchor(name, link, special = false) {
  const baseClasses =
    "mr-4 pl-4 pr-4 pt-1 pb-1 font-bold rounded-sm transition duration-300 ease-in-out";
  const hoverClasses =
    "hover:bg-[#858fb3] hover:text-white dark:hover:bg-[#4a4f70]";
  const specialClasses =
    " bg-[#ff563c] text-white hover:bg-[#ae2929] dark:bg-[#cc3c29] dark:hover:bg-[#992121]";

  let classes = baseClasses + " " + hoverClasses;
  if (special) {
    classes += " " + specialClasses;
  }

  return (
    <NavLink
      to={`/${link}`}
      className={({ isActive }) =>
        isActive
          ? `${classes} bg-[#97a6d5] text-white dark:bg-[#465a8d] dark:text-white`
          : `${classes} text-gray-900 dark:text-gray-100`
      }
    >
      {name}
    </NavLink>
  );
}