// import BannerImg from "../assets/Banner.png";
// import VectorCloud from "../assets/Vectorcloud.png";
// import Vector from "../assets/Vector.png";
// import InctureLogo from "../assets/InctureLogo.png";
// import { CSSTransition } from "react-transition-group";
// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";

// const LandingPage = () => {
//   const [inProp, setInProp] = useState(false);
//   const navigate = useNavigate();

//   const handleNavigation = () => {
//     setInProp(true);
//     setTimeout(() => {
//       navigate("/home");
//     }, 300); // Duration of the transition
//   };
//   return (
//     <CSSTransition in={inProp} timeout={1000} classNames="fade">
//     <div className="flex h-screen">
//       <div className="flex-1 w-3/5 flex items-center justify-center relative">
//         <img src={InctureLogo} className="absolute top-6 left-6 w-32"/>
//         <img src={BannerImg} alt="Server" className="max-w-full h-auto w-[50%]"/>
//       </div>
//       <div className="w-2/5 flex flex-col justify-center border-l-2 border-[#A1A7AE] text-white p-2 relative">
//         <div className="p-1">
//         <h1 className="text-5xl text-center text-[#2A4862] font-black">Integration <span className="font-extralight">Workbench</span></h1>
//         <p className="mt-4 text-xl text-[#2A4862] text-center">One stop solution for all your Integration needs</p>
//         <div className="flex justify-center">
//         <Link to="/home" className="w-full flex justify-center">
//           <button className="mt-24 text-xl font-semibold text-white bg-[#0A6Ed1] w-[95%] p-3 rounded" onClick={handleNavigation}>Begin Integration Journey</button>
//         </Link>
//         </div>
//         </div>
//         <img src={VectorCloud} alt="cloud" className="absolute top-10 right-0 w-24"/>
//         <img src={Vector} alt="Cloud" className="absolute bottom-10 -left-6 w-28"/>
//       </div>
//     </div>
//     </CSSTransition>
//   )
// }

// export default LandingPage;

import React from 'react';
import Incture from '../assets/logos/InctureLogo.svg'
import {Link} from "react-router-dom"
import Vector from "../assets/Vector.png"; 
const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#05386B] to-[#0A6ED1] text-white text-center p-4 relative">
      <img
        className="w-28 mb-8 absolute top-6 left-6 opacity-65"
        src={Incture} // Make sure to replace this with the actual path to the logo
        alt="Incture Logo"
      />
      <img
        className='w-28 opacity-15 absolute right-20 top-20'
        src={Vector}
      />
      <img
        className='w-28 opacity-15 absolute right-20 bottom-40'
        src={Vector}
      />
      <img
        className='w-28 opacity-15 absolute left-10 top-44'
        src={Vector}
      />
      <img
        className='w-28 opacity-15 absolute left-10 bottom-32'
        src={Vector}
      />
      <img
        className='w-32 opacity-15 absolute left-[500px] bottom-10'
        src={Vector}
      />
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Integration <span className='font-thin'>Workbench</span></h1>
      <p className="text-lg md:text-xl mb-6 font-thin">One stop solution for all your Integration needs</p>
      <Link to="/home" >
        <button className="bg-white text-[#0A6ED1] py-2 px-12 font-semibold rounded-sm hover:bg-gray-200 transition duration-200">
          Begin Integration Journey
        </button>
      </Link>
    </div>
  );
};

export default LandingPage;
