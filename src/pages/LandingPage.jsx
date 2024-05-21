import BannerImg from "../assets/Banner.png";
import VectorCloud from "../assets/Vectorcloud.png";
import Vector from "../assets/Vector.png";
import InctureLogo from "../assets/InctureLogo.png";
import { CSSTransition } from "react-transition-group";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const LandingPage = () => {
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
      <div className="flex-1 w-3/5 flex items-center justify-center relative">
        <img src={InctureLogo} className="absolute top-6 left-6 w-32"/>
        <img src={BannerImg} alt="Server" className="max-w-full h-auto w-[50%]"/>
      </div>
      <div className="w-2/5 flex flex-col justify-center border-l-2 border-[#A1A7AE] text-white p-2 relative">
        <div className="p-1">
        <h1 className="text-5xl text-center text-[#2A4862] font-black">Integration <span className="font-extralight">Workbench</span></h1>
        <p className="mt-4 text-xl text-[#2A4862] text-center">One stop solution for all your Integration needs</p>
        <div className="flex justify-center">
        <Link to="/home" className="w-full flex justify-center">
          <button className="mt-24 text-xl font-semibold text-white bg-[#0A6Ed1] w-[95%] p-3 rounded" onClick={handleNavigation}>Begin Integration Journey</button>
        </Link>
        </div>
        </div>
        <img src={VectorCloud} alt="cloud" className="absolute top-10 right-0 w-24"/>
        <img src={Vector} alt="Cloud" className="absolute bottom-10 -left-6 w-28"/>
      </div>
    </div>
    </CSSTransition>
  )
}

export default LandingPage;