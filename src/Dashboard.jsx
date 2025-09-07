import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "./Components/ThemeContext";
import { quizzes } from "./dump/quizCreated.jsx" ;
import { quizSub } from "./dump/quizAttempted.jsx" ;
import { notifications } from "./dump/notifications.jsx" ;
import { settings } from "./dump/settings.jsx" ;
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
import { Profile } from './Components/Profile.jsx'
import { QuizCreated } from './Components/QuizCreated.jsx';
import { QuizAttempted } from './Components/QuizAttempted.jsx';
import { Notifications } from './Components/Notifications.jsx';
import { Settings } from './Components/Settings.jsx';

export const Dashboard = () => {
  const [Isactive, setisactive] = useState("Profile");
  const [setting, setSettings] = useState(settings);
  const { darkMode } = useTheme();
  
  const handleSettingChange = (settingId) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  return (
    <div className="h-[90vh] w-screen grid grid-cols-[1fr_4fr] px-2 overflow-y-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="h-full w-full bg-white dark:bg-gray-800 border-r-2 border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <LeftPanel isactive={Isactive} setisactive={setisactive} />
      </div>
      <div className="h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto scrollbar transition-colors duration-300">
        {Isactive === "Profile" && <Profile />}
        {Isactive === "Quiz Created" && <QuizCreated quizzesCreated={quizzes.quizzesCreated}/>}
        {Isactive === "Quiz Attempted" && <QuizAttempted quizAttempted = {quizSub.quizAttempted}/>}
        {Isactive === "Notification" && <Notifications notifications = {notifications}/>}
        {Isactive === "Settings" && <Settings settings = {setting} onChange={handleSettingChange}/>}
      </div>
    </div>
  );
};
const LeftPanel = ({ isactive, setisactive }) => {
  return (
    <>
      <div className="px-5 py-2">
        {[
          [
            "Management",
            [
              ["Profile", faIdBadge],
              ["Quiz Created", faPenFancy],
              ["Quiz Attempted", faCircleCheck],
            ],
          ],
          [
            "User",
            [
              ["Notification", faBell],
              ["Settings", faGear],
            ],
          ],
        ].map((props, index) => {
          const isLast = index === 1; // since there are only two main sections
          return (
            <div key={index}>
              <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">{props[0]}</h2>
              <div
                className={`w-full grid grid-rows-subgrid px-2 py-2 gap-3 pb-5 mb-5${
                  !isLast ? " border-b-2 border-gray-200 dark:border-gray-600" : ""
                } transition-colors duration-300`} key={index}
              >
                {props[1].map((name, idx) => {
                  return (
                    <span
                      className={`${
                        isactive === name[0]
                          ? "bg-indigo-600 dark:bg-indigo-500 text-white font-bold shadow-lg"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
                      } px-4 py-2 rounded-2xl flex gap-3 items-center cursor-pointer transition-all duration-300`}
                      onClick={() => {
                        setisactive(name[0]);
                      }}
                      key={idx}
                    >
                      <FontAwesomeIcon icon={name[1]} />
                      <p>{name[0]}</p>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
