import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReadinessCheckMainPage from "../pages/ReadinessCheckMainPage";
import { readinessCheck } from "../../../apis/apiServiceNeo";

const ReadinessCheck = ({ setDisableNext }) => {
  const [isCheckStarted, setIsCheckStarted] = useState(false);

  const readinessCheckHandler = () => {
    readinessCheck();
    setIsCheckStarted(true);
  };

  return (
    <>
      {isCheckStarted ? (
        <ReadinessCheckMainPage setDisableNext={setDisableNext} />
      ) : (
        <div className="bg-[#EBf5FF] p-5 rounded">
          <h3 className="text-xl font-bold mb-4 text-[#2A4862]">
            Integration Workbench
          </h3>
          <p className="text-[#32363A]">
            Integration Workbench facilitates the seamless migration of
            integrations from SAP NEO Data Centers to SAP Integration Suite
            (Cloud Foundry) through an interactive user interface. This
            migration tool is crafted to drastically reduce manual migration
            efforts and eliminate the possibility of human error in the process.
          </p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-[#0A6ED1] text-white rounded p-2 px-6 hover:bg-gray-300 hover:text-black transition duration-200"
              onClick={readinessCheckHandler}
            >
              Start System Readiness Check
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReadinessCheck;
