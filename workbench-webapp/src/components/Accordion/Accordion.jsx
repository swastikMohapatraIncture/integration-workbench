import React, { useState } from 'react';
import { sections } from '../../constants/data';
import { IoIosArrowDown } from "react-icons/io";


const Accordion = () => {
  const [openIndex, setOpenIndex] = useState({});

  const toggleAccordion = (sectionIndex, itemIndex) => {
    setOpenIndex((prevOpenIndex) => ({
      ...prevOpenIndex,
      [sectionIndex]: prevOpenIndex[sectionIndex] === itemIndex ? null : itemIndex,
    }));
  };

  return (
    <div className="m-5 text-[#32363A]">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-5">
          <h2 className="text-lg font-semibold mb-3 ">{section.sectionTitle}</h2>
          {section.items.map((item, itemIndex) => (
            <div key={itemIndex} className="border border-[#89919A] mb-2 rounded">
              <button
                className="w-full flex justify-between items-center p-2 focus:outline-none"
                onClick={() => toggleAccordion(sectionIndex, itemIndex)}
              >
                <span className='font-semibold'>{item.title}</span>
                <span className={`transform transition-transform duration-300 ${openIndex[sectionIndex] === itemIndex ? 'rotate-180' : ''}`}>
                  <IoIosArrowDown />
                </span>

              </button>
              <div
                className={`overflow-hidden transition-max-height duration-300 ${
                  openIndex[sectionIndex] === itemIndex ? 'max-h-screen' : 'max-h-0'
                }`}
              >
                <div className="p-4">
                  <p>{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
