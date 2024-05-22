import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import TablePage from "../components/AutomatedTesting/TablePage";
import AutomatedForm from "../components/AutomatedTesting/AutomatedForm";
import { Divider } from "@mui/material";

const steps = ["Select Tenant", "Select ICO"];

const AutomatedTesting = () => {
  const [agentSelected, setAgentSelected] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const totalSteps = () => {
    return steps?.length;
  };

  const completedSteps = () => {
    return Object?.keys(completed)?.length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <TablePage agentSelected={agentSelected} setAgentSelected={setAgentSelected}/>;
      case 1:
        return <AutomatedForm />;
      // case 2:
      //   return <Step3Content />;
      // default:
      //   return <div>Unknown step</div>;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Divider sx={{ marginTop: "8px" }} />
      <div>
        <Typography sx={{ mt: 2, mb: 1, py: 1, height: "100%" }}>
          {renderStepContent(activeStep)}
        </Typography>
        <Box className="gap-4" sx={{ display: "flex", flexDirection: "row",justifyContent:"end", pt: 2 ,position: "fixed", bottom: 56, left: 230, right: 0}}>
          {/* <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1, textTransform: "capitalize" }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            onClick={handleNext}
            sx={{ mr: 1, textTransform: "capitalize" }}
          >
            Next
          </Button> */}
           <button
                className="bg-[#0A6ED1] text-white rounded-sm px-4 py-1 hover:bg-gray-100 hover:text-black transition duration-200 "
                onClick={handleBack}
              >
                Back
              </button>
              {/* <Link to="/Migrate"> */}
                <button
                  className={`bg-[#0A6ED1]  rounded-sm px-4 py-1  transition duration-200   ${
                    !agentSelected
                      ? " bg-gray-300 text-black cursor-not-allowed"
                      : "bg-[#0A6ED1] text-white hover:bg-gray-100 hover:text-black transition duration-500 "
                  } mr-3`}
                  onClick={handleNext}
                  disabled={!agentSelected}
                >
                  Next
                </button>
                {/* </Link> */}
        </Box>
      </div>
    </Box>
  );
};

export default AutomatedTesting;
