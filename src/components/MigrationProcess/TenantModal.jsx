/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Divider, StepConnector, stepConnectorClasses, styled } from "@mui/material";
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
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#0854A0',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#0854A0',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderLeftWidth: 3,
    },
  }));

  // const CustomStepConnector = styled(StepConnector)(({ theme, index, activeStep }) => ({
  //   '& .MuiStepConnector-line': {
  //     transition: theme.transitions.create('border-color'),
  //     borderColor: index > activeStep ? 'blue' : 'gray', 
  //     borderLeftWidth: 2, 
  //   },
  // }));
  

  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black opacity-50"></div>
      <div className="fixed top-1/2 left-1/2 p-2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] w-2/3    box-border bg-white shadow-md rounded-md">
        <div className="mb-1">
          <h2 className="text-xl">System Configuration</h2>
        </div>
        <Divider />
        <div className="flex h-fit">
          {/* Stepper */}
          <div className="flex flex-col items-center w-1/4 border-r border-gray-300">
            <Box className="ml-2" sx={{ width: "100%" }}>
              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                connector={<QontoConnector />}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </div>
          {/* Content */}
          <div className="flex flex-col mt-3  w-3/4 px-4 ">
            {activeStep === 0 && <div><IntroContent/></div>}
            {activeStep === 1 && <div><PODetails/></div>}
            {activeStep === 2 && <div><CPIDetails/></div>}
            {activeStep === 3 && <div><APIDetails/></div>}
            {/* Next and Back buttons */}
          </div>
        </div>
        <div className="flex border-t p-2 justify-end gap-3 mb-[-2px] ">
          <button
            className={` p-2 rounded-md border border-modalColor text-modalColor ${
              activeStep === 0
                ? "bg-gray-300  cursor-not-allowed"
                : " text-white"
            }`}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </button>
          <button
            className={`p-2 rounded-md border border-modalColor text-modalColor ${
              activeStep === 3
                ? "bg-gray-300 cursor-not-allowed"
                : " text-white"
            }`}
            onClick={handleNext}
            disabled={activeStep === 3}
          >
            Next
          </button>
          <button
            className="p-2 rounded-md border border-modalColor text-modalColor"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default TenantModal;
