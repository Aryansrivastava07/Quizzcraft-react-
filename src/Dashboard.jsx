import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { Profile } from './Profile.jsx'
import { QuizCreated } from './QuizCreated.jsx';
import { QuizAttempted } from './QuizAttempted.jsx';
import { Notifications } from './Notifications.jsx';
import { Settings } from './Settings.jsx';

export const Dashboard = () => {
  const [Isactive, setisactive] = useState("Profile");
  const [setting, setSettings] = useState(settings);
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
    <div className="h-[90vh] w-screen grid grid-cols-[1fr_4fr] px-2 overflow-y-hidden">
      <div className="h-full w-full bg-[#f8f9fa] border-r-2 border-gray-200">
        <LeftPanel isactive={Isactive} setisactive={setisactive} />
      </div>
      <div className="h-full w-full bg-white overflow-y-auto scrollbar">
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
              <h2 className=" text-sm text-[#979da9] mb-2">{props[0]}</h2>
              <div
                className={`w-full grid grid-rows-subgrid px-2 py-2 gap-3 pb-5 mb-5${
                  !isLast ? " border-b-2 border-[#e3e5e9]" : ""
                }`} key={index}
              >
                {props[1].map((name, idx) => {
                  return (
                    <span
                      className={`${
                        isactive === name[0]
                          ? "bg-[#636ae8] text-white font-bold"
                          : " text-[#717883]"
                      } px-4 py-2 rounded-2xl  flex gap-3 items-center cursor-pointer`}
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
