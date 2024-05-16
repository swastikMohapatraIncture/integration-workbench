import SelectedPhoto from "../assets/SelectedPhoto.png";
import {stats} from '../constants/data';

const About = () => {
  return (
    <div>
      <header className="h-44 bg-[#CEEAF3]">
        <h1 className="text-4xl text-center pt-5 font-semibold text-[#212529]">Enhancing people's lives <br></br> with digital systems</h1>
        <p className="text-center pt-5 text-[#212529]">Incture is on a mission to build digital systems to drive business outcomes</p>
      </header>
      <article className="flex w-[75%] mx-auto mt-14 gap-20">
        <aside className="flex flex-col justify-center">
          <span className="text-[#6B7281] mb-3 text-l font-bold">OUR STORY</span>
          <h2 className="mb-2 text-[#212529] text-2xl font-bold">We're all about digital</h2>
          <p className="text-l">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui laudantium eos quibusdam veniam omnis magni adipisci cupiditate illo perspiciatis quidem reiciendis assumenda cum, accusantium delectus? Dignissimos, ab sunt? Minima, rem?
          </p>
        </aside>
        <img src={SelectedPhoto} className="h-72 mt-5"/>
      </article>
      <div className="h-44 bg-[#F8F8F8] mt-14 flex text-center justify-evenly">
      {stats.map((stat, index) => (
          <div key={index} className="w-56 flex flex-col justify-center">
            <span className="text-7xl text-[#0387D5]">{stat.value}</span>
            <p className="font-bold text-l mt-2">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
