import BannerImg from "../assets/Banner.png";
import VectorCloud from "../assets/Vectorcloud.png";
import Vector from "../assets/Vector.png";
import { CSSTransition } from "react-transition-group";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const HomePage = () => {
  const [inProp, setInProp] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = () => {
    setInProp(true);
    setTimeout(() => {
      navigate("/home");
    }, 300); // Duration of the transition
  };
  return (
    <CSSTransition in={inProp} timeout={1000} classNames="fade">
    <div className="flex h-screen">
      <div className="flex-1 w-3/5 flex items-center justify-center">
        <img src={BannerImg} alt="Server" className="max-w-full h-auto w-[50%]"/>
      </div>
      <div className="w-2/5 flex flex-col justify-center bg-[#2A4862] text-white p-8 relative">
        <div className="p-5">
        <h1 className="text-6xl text-left font-bold">Integration Workbench</h1>
        <p className="mt-4 text-xl">One stop solution for all your Integration needs</p>
        <div className="flex justify-center">
          
          <button className="mt-36 text-xl font-semibold text-[#2A4862] bg-white w-full p-3 rounded" onClick={handleNavigation}><Link to="/home">Begin Integration Journey</Link></button>
         
        </div>
        </div>
        <img src={VectorCloud} alt="cloud" className="absolute top-10 right-0 w-24"/>
        <img src={Vector} alt="Cloud" className="absolute bottom-10 -left-6 w-28"/>
      </div>
    </div>
    </CSSTransition>
  )
}

export default HomePage;