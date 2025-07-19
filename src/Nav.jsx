import React from "react";
import { NavLink } from 'react-router-dom';

export const Nav = ({children}) => {
//   function dropdown(name){
//     return(
// <div className="relative group inline-block transition duration-300 ease-in-out">
//       <button className="bg-highlight text-white font-medium py-2 px-4 rounded-md">
//         {name}
//       </button>
//       <div className="absolute left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg scale-y-0 origin-center transition-transform duration-200 ease-out group-hover:scale-y-100">
//         <ul className="p-2 w-max">
//           <li className="block px-4 py-2 text-secondary cursor-pointer hover:bg-tertiary hover:text-white">
//             Option 1
//           </li>
//           <li className="block px-4 py-2 text-secondary cursor-pointer hover:bg-tertiary hover:text-white">
//             Option 2
//           </li>
//           <li className="block px-4 py-2 text-secondary cursor-pointer hover:bg-tertiary hover:text-white">
//             Option 3
//           </li>
//         </ul>
//       </div>
//     </div>
//     )
//   }
  return (
    // <nav className="flex items-center justify-between flex-wrap pl-8 pr-8 max-w-screen bg-linear-to-r from-[#e2e2e2] to-[#c9d6ff]">
    <nav className="fixed top-0 flex items-center w-screen justify-between flex-wrap pl-8 pr-8 max-w-screen bg-gray-50 z-10 backdrop-blur-2xl  mb-20 border-b-2 border-gray-200">
      <img src="src/assets/logo2.png" alt="logo" className ="w-18 " height="500" width="500" />
      <menu className="relative flex items-center justify-between flex-wrap " >
        {children}
      </menu>
    </nav>
  );
};
 export function anchor(name ,link, special = false) {
    let classes = "mr-4 pl-4 pr-4 pt-1 pb-1 font-bold rounded-sm hover:bg-[#858fb3] hover:text-white transition duration-300 ease-in-out ";
    if (special) {
      classes += " bg-[#ff563c] text-white hover:bg-[#ae2929] hover:text-white";
    }
    return (
        <NavLink to={`/${link}`}
        className = {({ isActive }) => isActive ? `${classes} text-white bg-[#97a6d5] }` : `${classes} text-gray-900`}
        >
          {name}
        </NavLink>
    );
  }