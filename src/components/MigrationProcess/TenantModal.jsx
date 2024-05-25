/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { StepConnector, stepConnectorClasses, styled } from "@mui/material";
import { useEffect, useState } from "react";
import IntroContent from "./TenantModal/IntroContent";
import PODetails from "./TenantModal/PODetails";
import CPIDetails from "./TenantModal/CPIDetails";
import APIDetails from "./TenantModal/APIDetails";
import { ToastContainer, toast } from "react-toastify";
// import Table from "./Table";  // Import the Table component

const steps = ["Introduction", "PO details", "IS details", "API details"];

const TenantModal = ({ agents, setAgents, setOpenModal,editingAgentIdx,setEditingAgentIdx }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  // const [editingAgentIdx, setEditingAgentIdx] = useState(-1);
  const [showPassword, setShowPassword] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [testingConn, setTestingConn] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompletedSteps([...completedSteps, activeStep]);
    setDisableNext(true);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCompletedSteps(completedSteps.filter((step) => step !== activeStep));
  };


  const handleSubmitAgent = () => {
    const currAgent = JSON.parse(localStorage?.getItem("currAgent"));
    let allPrevAgents = JSON.parse(localStorage?.getItem("agents")) || [];
  
    if (editingAgentIdx >= 0) {
      allPrevAgents[editingAgentIdx] = currAgent;
    } else {
      allPrevAgents?.push(currAgent);
    }
  
    localStorage.setItem("agents", JSON.stringify(allPrevAgents));
    localStorage.removeItem("currAgent");
  
    setAgents(allPrevAgents);
    setEditingAgentIdx(-1);
    setOpenModal(false);
  };
  

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

  useEffect(() => {
    if (activeStep === 0) {
      setDisableNext(false);
    }
  }, [activeStep]);

  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black opacity-50"></div>
      <div className="justify-center items-center flex overflow-x-hidden z-[1000] overflow-y-auto fixed inset-0 outline-none focus:outline-none">
        <ToastContainer />
        <div className="relative w-auto my-3 mx-auto">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
              <div className="flex flex-col items-center p-3 w-[170px] border-r border-gray-300">
                <Box sx={{ width: "100%" }}>
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

              <div className="p-3 w-full overflow-y-auto ">
                {activeStep === 0 && <IntroContent />}
                {activeStep === 1 && (
                  <PODetails
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    setDisableNext={setDisableNext}
                    testingConn={testingConn}
                    setTestingConn={setTestingConn}
                  />
                )}
                {activeStep === 2 && (
                  <CPIDetails
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    setDisableNext={setDisableNext}
                    testingConn={testingConn}
                    setTestingConn={setTestingConn}
                  />
                )}
                {activeStep === 3 && (
                  <APIDetails
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    setDisableNext={setDisableNext}
                    testingConn={testingConn}
                    setTestingConn={setTestingConn}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end px-4 py-3 border-t border-solid border-blueGray-200 rounded-b">
              {activeStep > 0 && (
                <button
                  className="py-1 px-3 rounded-md border border-modalColor text-modalColor"
                  onClick={handleBack}
                >
                  Back
                </button>
              )}
             {activeStep < steps.length - 1 ? (
                <button
                  className="py-1 px-3 rounded-md border border-modalColor text-modalColor"
                  onClick={handleNext}
                  disabled={disableNext}
                >
                  Next
                </button>
              ) : (
                <button
                  className="py-1 px-3 rounded-md border border-modalColor text-modalColor"
                  onClick={handleSubmitAgent}
                  disabled={disableNext}
                >
                  Submit
                </button>
              )}
              <button
                className="py-1 px-3 rounded-md border border-modalColor text-modalColor"
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
