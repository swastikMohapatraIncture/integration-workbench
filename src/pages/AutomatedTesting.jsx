/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import TablePage from "../components/AutomatedTesting/TablePage";
import AutomatedForm from "../components/AutomatedTesting/AutomatedForm";
import { Divider } from "@mui/material";
import { generateReport } from "../apis/apiService";

const ReportModal = ({ setReportModal }) => {
  return (
    <>
      <div className="opacity-25 fixed inset-0 z-[1000] bg-black"></div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[1000] outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto ">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white h-[550px]">
            {/*header*/}
            <div className="flex items-start justify-between p-3 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-2xl font-semibold">Comparision Status</h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                <table className="min-w-full divide-y  divide-gray-200 border border-gray-300 text-sm">
                  <thead className="bg-[#F2F2F2]">
                    <tr>
                      <th scope="col" className="px-5 py-2 border-gray-200 ">
                        Sl No
                      </th>
                      <th className="px-6 py-2 text-left  font-bold text-[#32363A] tracking-wider border-gray-200">
                        ICO
                      </th>
                      <th className="px-6 py-2 text-left  font-bold text-[#32363A] tracking-wider border-gray-200">
                        IFlow
                      </th>
                      <th className="px-6 py-2 text-left  font-bold text-[#32363A] tracking-wider border-gray-200">
                        No. of Test cases ran
                      </th>
                      <th className="px-6 py-2 text-left  font-bold text-[#32363A] tracking-wider border-gray-200">
                        Overall Status
                      </th>
                      {/* <th className="px-6 py-2 text-left  font-bold text-[#32363A] tracking-wider border-gray-200">
                        Actions
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* {agents &&
                agents.length > 0 &&
                agents.map((agent, index) => ( */}
                    <tr className="hover:bg-gray-100">
                      {/* <td className="whitespace-nowrap  border-gray-200 text-center">
                      <input
                        type="radio"
                        name="agent"
                        onChange={() => {
                          localStorage?.setItem(
                            "currAgent",
                            JSON?.stringify(agent)
                          );
                          setAgentSelected(true);
                        }}
                      />
                    </td> */}
                      <td className="px-6 py-3 whitespace-nowrap  text-[#32363A]  border-gray-200">
                        {/* {agent?.poData?.name} */}1
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap  text-[#32363A]  border-gray-200">
                        {/* {agent?.poData?.name} */}
                        test
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-[#32363A]  border-gray-200">
                        {/* {agent?.poData?.environment} */}
                        test
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-[#32363A]  border-gray-200">
                        {/* {agent?.cpiData?.name} */}
                        test
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-[#32363A]  border-gray-200">
                        {/* {agent?.cpiData?.environment} */}
                        test
                      </td>
                      {/* <td className="px-6 py-3 whitespace-nowrap text-[#32363A]  border-gray-200">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => handleEditAgent(index)}
                      >
                        <MdOutlineModeEdit className="text-blue-600 text-xl" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        // onClick={() => handleDeleteAgent(index)}
                        onClick={() => setDeleteModal({ open: true, index })}
                      >
                        <RiDeleteBin6Line className="text-red-600 text-xl" />
                      </button> */}
                      {/* </td> */}
                    </tr>
                    {/* ))} */}
                  </tbody>
                </table>
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="border border-[#0A6ED1] text-[#0A6ED1]   text-sm px-4 py-3 rounded hover:bg-[#0A6ED1] hover:text-white mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setReportModal(false)}
              >
                Download
              </button>
              <button
                className="text-#0A6ED1 px-4 py-3 text-sm  mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setReportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const steps = ["Select Tenant", "Select ICO"];

const AutomatedTesting = () => {
  const [agentSelected, setAgentSelected] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [reportGenerate, setReportGenerate] = useState([]);
  const [getICOS, setGetICOS] = useState([]);
  const [getIFlow, setGetIflow] = useState([]);
  // const [fileRows, setFileRows] = useState([{ request: null, response: null }]);
  const [sections, setSections] = useState([
    {
      showMore: false,
      fileRows: [{ request: null, response: null }],
    },
  ]);
  const [reportModal, setReportModal] = useState(false);

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

  const handleCompare = () => {
    const agentStorage = localStorage?.getItem("currAgent");
    const poDetails = agentStorage ? JSON.parse(agentStorage)?.poData : {};
    const cpiDetails = agentStorage ? JSON.parse(agentStorage)?.cpiData : {};
    const apiDetails = agentStorage ? JSON.parse(agentStorage)?.apiData : {};
    const fileComparePayload = sections?.map((section, sectionIndex) => ({
      ...reportGenerate[sectionIndex],
      payload: section?.fileRows?.map((row, rowIndex) => ({
        requestFilename: row?.request?.name || "",
        responseFilename: row?.response?.name || "",
        testCaseName: `Test Case 01`,
      })),
    }));

    const payload = {
      poAgentDTO: poDetails,
      apiAgent: cpiDetails,
      cpiAgent: apiDetails,
      fileComparePayload,
    };

    console.log("fileTest:", payload);
    const report = generateReport(payload);
    console.log(report);
    setReportModal(true);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TablePage
            agentSelected={agentSelected}
            setAgentSelected={setAgentSelected}
          />
        );
      case 1:
        return (
          <AutomatedForm
            getICOS={getICOS}
            setGetICOS={setGetICOS}
            getIFlow={getIFlow}
            setGetIflow={setGetIflow}
            // fileRows={fileRows}
            // setFileRows={setFileRows}
            reportGenerate={reportGenerate}
            setReportGenerate={setReportGenerate}
            sections={sections}
            setSections={setSections}
          />
        );
      default:
        return <div>Unknown step</div>;
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
      <Stepper activeStep={activeStep} sx={{ width: "50%" }}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Divider sx={{ marginTop: "6px" }} />
      <div>
        <Typography sx={{ mt: 2, mb: 1, py: 1, height: "100%" }}>
          {renderStepContent(activeStep)}
        </Typography>
        <Box
          className="gap-4"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            pt: 2,
            borderTop: 1,
            backgroundColor: "white",
            borderColor: "#E5E5E5",
            position: "fixed",
            bottom: 65,
            left: 230,
            right: 0,
          }}
        >
          {/* <button
            className="bg-[#0A6ED1] text-white rounded-sm px-4 py-1 hover:bg-gray-100 hover:text-black transition duration-200"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </button> */}
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep === 0 && (
            <button
              className={`bg-[#0A6ED1]  rounded-sm px-4 py-1  transition duration-200 ${
                !agentSelected
                  ? "bg-gray-300 text-black cursor-not-allowed"
                  : "bg-[#0A6ED1] text-white hover:bg-gray-100 hover:text-black transition duration-500"
              } mr-3`}
              onClick={handleNext}
              disabled={!agentSelected}
            >
              Next
            </button>
          )}
          {activeStep === 1 && (
            <button
              className="bg-[#0A6ED1] text-white rounded-sm px-4 py-1 hover:bg-gray-100 hover:text-black transition duration-200 mr-3"
              // onClick={handleNext}
              onClick={handleCompare}
            >
              Compare
            </button>
          )}
        </Box>
      </div>
      {reportModal && <ReportModal setReportModal={setReportModal} />}
    </Box>
  );
};

export default AutomatedTesting;
