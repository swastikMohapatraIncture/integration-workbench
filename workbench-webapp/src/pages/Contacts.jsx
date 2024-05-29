import personOne from "../assets/personOne.png";
import personTwo from '../assets/personTwo.png';
import { officeLocations } from "../constants/data";
import {useState} from "react";

const Contacts = () => {
  const [selectedLocation, setSelectedLocation] = useState(officeLocations[0].url);
  return (
    <div>
      <header className="h-44 bg-[#CEEAF3] flex flex-col justify-center">
        <h1 className="text-4xl text-center font-semibold text-[#212529]">Contact Us</h1>
        <p className="text-center text-[#212529] mt-2">We'd love to hear from you!</p>
      </header>
      <section className="flex gap-5 p-4">
        <div className="flex gap-5 border border-[#A1A7AE] flex-1 p-3 rounded">
          <img src={personOne} alt="personOne"/>
          <div className="flex flex-col justify-between p-1">
            <span className="font-bold text-[#212529]">Name</span>
            <span>Designation</span>
            <span>Mail ID</span>
            <span>Phone Number</span>
          </div>
        </div>
        <div className="flex gap-5 border border-[#A1A7AE] flex-1 p-3 rounded">
          <img src={personTwo} alt="personTwo" />
          <div className="flex flex-col justify-between p-1">
            <span className="font-bold text-[#212529]">Name</span>
            <span>Designation</span>
            <span>Mail ID</span>
            <span>Phone Number</span>
          </div>
        </div>
      </section>

      <section className="p-4 mt-5">
        <h2 className="text-2xl text-center font-semibold text-[#6B7281] mb-4">Our Presence</h2>
        <div className="w-full flex justify-center gap-5 h-full">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6941.951963562122!2d85.74268237330104!3d20.292593098042925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19073c4dd69e5d%3A0x46c9ec1a4a819fb0!2zSW5jdHVyZSjgrIfgrJngrY3grJXgrY3grJrgrLDgrY0g4Kyf4K2H4KyV4K2N4Kyo4K2L4Kyy4K2L4Kyc4Ky_4Ky44K2NKQ!5e0!3m2!1sen!2sin!4v1715837162435!5m2!1sen!2sin" 
            width="500" 
            height="350" 
            allowfullscreen="" 
            loading="lazy">
            </iframe>
          <div className="flex flex-col w-2/5 mt-6">
              {officeLocations.map((location, index) => (
                <div
                  key={index}
                  className={`p-1 overflow-hidden border-b cursor-pointer ${selectedLocation === location.url ? 'bg-[#DDDDDD]' : ''}`}
                  onClick={() => setSelectedLocation(location.url)}
                >
                  <div className="text-[#212529] font-semibold">{location.name}</div>
                  <div className="text-sm text-gray-700">{location.description}</div>
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  )
}

export default Contacts
