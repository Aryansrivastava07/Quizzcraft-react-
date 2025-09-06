import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div
    className="h-[90vh] w-screen grid place-items-center 
  bg-gradient-to-b
   from-[#fefefe] to-[#030b2b5f]
   dark:from-[#0f1726] dark:to-gray-950
 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)] "
  >
    <div className="min-h-[80vh] w-[80vw] m-auto bg-white rounded-2xl shadow-2xl p-5 grid grid-cols-2 bg-gradient-to-l dark:from-gray-950 dark:to-gray-900  from-[#5a5d685f] to-[#fefefe]">
      <div className="grid place-items-center">
        <img
          src="../src/assets/logo2.png"
          alt=""
          className="w-[90%] aspect-auto"
        />
      </div>
      <div className="grid grid-rows-[auto_20px] dark:text-white">
        <Outlet />
      </div>
    </div>
  </div>
);
// export const AuthLayout = () => (
//   <div className="h-[90vh] w-screen grid place-items-center
//   bg-gradient-to-b from-[#b8b8b837] to-[#1b213722]
//    dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)] ">
//       <div className="min-h-[80vh] w-[80vw] m-auto bg-white rounded-2xl shadow-2xl p-5 grid grid-cols-2 bg-gradient-to-t from-slate-900 to-slate-800 ">
//         <div className="grid place-items-center">
//           <img
//             src="../src/assets/logo2.png"
//             alt=""
//             className="w-[90%] aspect-auto"
//           />
//         </div>
//         <div className="grid grid-rows-[auto_20px] dark:text-white">
//           <Outlet />
//         </div>
//       </div>
//     </div>
// );
