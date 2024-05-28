/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { StepConnector, stepConnectorClasses, styled } from "@mui/material";
import { useState, useEffect } from "react";
import IntroContent from "./TenantModal/IntroContent";
import NeoDetails from "./TenantModal/NeoDetails";
import CFDetails from "./TenantModal/CFDetails";
import { ToastContainer } from "react-toastify";

const steps = ["Introduction", "NEO details", "CF details"];

const TenantModal = ({
  tenants,
  setTenants,
  setOpenModal,
  editingAgentIdx,
  setEditingAgentIdx,
  agentSelected,
  setAgentSelected,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [testingConn, setTestingConn] = useState(false);
  const [currAgent, setCurrAgent] = useState(null);
  // const [connectionStatus, setConnectionStatus] = useState(false);
  // const [connectionMessage, setConnectionMessage] = useState("");

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompletedSteps([...completedSteps, activeStep]);
    setDisableNext(true);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCompletedSteps(completedSteps.filter((step) => step !== activeStep));
  };

  useEffect(() => {
    const currAgentLocal = JSON?.parse(localStorage?.getItem("currNeoAgent"));
    if (currAgentLocal) {
      setCurrAgent(currAgentLocal);
    }

    console.log(currAgentLocal);
  }, [disableNext]);

  const handleSubmitAgent = () => {
    const currNeoData = JSON.parse(localStorage?.getItem("currNeoAgent"));
    let allPrevAgents = JSON.parse(localStorage?.getItem("tenants")) || [];

    if (editingAgentIdx >= 0) {
      allPrevAgents[editingAgentIdx] = currNeoData;
    } else {
      allPrevAgents?.push(currNeoData);
    }

    localStorage.setItem("tenants", JSON.stringify(allPrevAgents));
    localStorage.removeItem("currNeoAgent");

    setTenants(allPrevAgents);
    setEditingAgentIdx(-1);
    setOpenModal(false);
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

  useEffect(() => {
    if (activeStep === 0) {
      setDisableNext(false);
    }
  }, [activeStep]);

  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black opacity-50"></div>
      <div className="justify-center items-center  flex overflow-x-hidden z-[1000] overflow-y-auto fixed inset-0 outline-none focus:outline-none">
        <ToastContainer />
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
                {activeStep === 0 && (
                  <div>
                    <IntroContent />
                  </div>
                )}
                {activeStep === 1 && (
                  <div>
                    <NeoDetails
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      setDisableNext={setDisableNext}
                      testingConn={testingConn}
                      setTestingConn={setTestingConn}
                      currAgent={currAgent}
                      // connectionMessage={connectionMessage}
                      // setConnectionMessage={setConnectionMessage}
                      // connectionStatus={connectionStatus}
                      // setConnectionStatus={setConnectionStatus}
                    />
                  </div>
                )}
                {activeStep === 2 && (
                  <div>
                    <CFDetails
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      setDisableNext={setDisableNext}
                      // fileName={fileName}
                      // setFileName={setFileName}
                      testingConn={testingConn}
                      setTestingConn={setTestingConn}
                      currAgent={currAgent}
                      // connectionMessage={connectionMessage}
                      // setConnectionMessage={setConnectionMessage}
                      // connectionStatus={connectionStatus}
                      // setConnectionStatus={setConnectionStatus}
                    />
                  </div>
                )}
              </div>
            </div>
            {/*footer*/}

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
                  className={`py-1 px-3 rounded-md border ${
                    disableNext
                      ? "text-modalColor border-modalColor cursor-not-allowed"
                      : " text-modalColor border-modalColor"
                  }`}
                  onClick={handleNext}
                  disabled={disableNext}
                >
                  Next
                </button>
              ) : (
                <button
                  className={`py-1 px-3 rounded-md border ${
                    disableNext
                      ? "text-modalColor border-modalColor cursor-not-allowed"
                      : " text-modalColor border-modalColor"
                  }`}
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
