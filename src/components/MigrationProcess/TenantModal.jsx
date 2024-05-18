/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  StepConnector,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import { useState } from "react";
import IntroContent from "./TenantModal/IntroContent";
import PODetails from "./TenantModal/PODetails";
import CPIDetails from "./TenantModal/CPIDetails";
import APIDetails from "./TenantModal/APIDetails";

const steps = ["Introduction", "PO details", "CPI details", "API details"];

const TenantModal = ({ setOpenModal }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompletedSteps([...completedSteps, activeStep]);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCompletedSteps(completedSteps.filter((step) => step !== activeStep));
  };

  // const isStepCompleted = (step) => {
  //   return completedSteps.includes(step);
  // };

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#0854A0",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#0854A0",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderLeftWidth: 2,
    },
  }));

  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black opacity-50"></div>
      <div className="justify-center items-center  flex overflow-x-hidden z-[1000] overflow-y-auto fixed inset-0 outline-none focus:outline-none">
        <div className="relative w-auto  my-3 mx-auto ">
          {/*content*/}
          <div className="border-0  rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-2 border-b border-solid border-blueGray-200 rounded-t">
              <div className="mb-1">
                <h2 className="text-xl">System Configuration</h2>
              </div>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setOpenModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <div className="flex flex-row h-[60vh] w-[70vw]">
              <div className="flex flex-col items-center p-3  w-[170px] border-r border-gray-300">
                <Box  sx={{ width: "100%" }}>
                  <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
                    connector={<QontoConnector />}
                  >
                    {steps.map((label) => (
                      <Step key={label} 
                      // sx={{
                      //   "& .MuiStepLabel-root": {
                      //     paddingLeft: "4px",
                      //     borderLeft: "4px solid red"
                      //   },
                      //   "& .Mui-disabled": {
                      //     paddingLeft: "4px",
                      //     borderLeft: "4px solid white"
                      //   }

                      // }}
                      >
                        <StepLabel >{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </div>

              <div className="p-3 w-full overflow-y-auto ">
                {activeStep === 0 && (
                  <div>
                    <IntroContent />
                  </div>
                )}
                {activeStep === 1 && (
                  <div>
                    <PODetails />
                  </div>
                )}
                {activeStep === 2 && (
                  <div>
                    <CPIDetails />
                  </div>
                )}
                {activeStep === 3 && (
                  <div>
                    <APIDetails />
                  </div>
                )}
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center gap-3 justify-end px-4 py-3 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className={` py-1 px-3 rounded-md border border-modalColor text-modalColor ${
                  activeStep === 0 ? "bg-gray-300  cursor-not-allowed" : " "
                }`}
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </button>
              <button
                className={` py-1 px-3 rounded-md border border-modalColor text-modalColor ${
                  activeStep === 3 ? "bg-gray-300 cursor-not-allowed" : " "
                }`}
                onClick={handleNext}
                disabled={activeStep === 3}
              >
                Next
              </button>
              <button
                className=" py-1 px-3 rounded-md border border-modalColor text-modalColor"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TenantModal;
