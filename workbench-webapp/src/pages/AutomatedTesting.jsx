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
import Loader from "../components/Loader";

// Component to render the report modal
const ReportModal = ({ setReportModal, reportPayload, resetForm }) => {
  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    try {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;``
    } catch (error) {
      console.error("Failed to convert Base64 to Blob:", error);
      return null;
    }
  };

  const handleDownload = () => {
    try {
      if (!reportPayload?.excelBase64) {
        throw new Error("No data available for download.");
      }

      const base64Regex = /^[A-Za-z0-9+/]+[=]{0,2}$/;
      const isValidBase64 = base64Regex.test(reportPayload.excelBase64);

      if (!isValidBase64) {
        throw new Error("The Base64 string is not correctly encoded.");
      }

      const blob = b64toBlob(reportPayload.excelBase64, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      if (!blob) {
        throw new Error("Failed to create Blob from Base64 string.");
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "test_report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error.message);
      alert(`Error downloading the file: ${error.message}`);
    }
  };

  return (
    <>
      <div className="opacity-25 fixed inset-0 z-[1000] bg-black"></div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[1000] outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto ">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white h-[550px]">
            {/*header*/}
            <div className="flex items-start justify-between p-3 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-2xl font-semibold">Comparison Status</h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 text-sm">
                <thead className="bg-[#F2F2F2]">
                  <tr>
                    <th scope="col" className="px-5 py-2 border-gray-200">Sl No</th>
                    <th className="px-6 py-2 text-left font-bold text-[#32363A] tracking-wider border-gray-200">ICO</th>
                    <th className="px-6 py-2 text-left font-bold text-[#32363A] tracking-wider border-gray-200">IFlow</th>
                    <th className="px-6 py-2 text-left font-bold text-[#32363A] tracking-wider border-gray-200">No. of Test cases ran</th>
                    <th className="px-6 py-2 text-left font-bold text-[#32363A] tracking-wider border-gray-200">Overall Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportPayload.comparisonPayload.length > 0 ? (
                    reportPayload.comparisonPayload.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">{index + 1}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">{item?.icoName}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">{item?.iflowName}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">{item?.comparedPayload}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-[#32363A] border-gray-200">{item?.successfulCompared}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-3 text-center text-[#32363A] border-gray-200">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="border border-[#0A6ED1] text-[#0A6ED1] text-sm px-4 py-3 rounded hover:bg-[#0A6ED1] hover:text-white mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleDownload}
              >
                Download
              </button>
              <button
                className="text-#0A6ED1 px-4 py-3 text-sm mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  setReportModal(false);
                  // resetForm();
                }}
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
  const [loading, setLoading] = useState(false);
  const [agentSelected, setAgentSelected] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [reportGenerate, setReportGenerate] = useState({});
  const [getICOS, setGetICOS] = useState([]);
  const [getIFlow, setGetIflow] = useState([]);
  const [sections, setSections] = useState([
    {
      showMore: false,
      fileRows: [{ request: null, response: null, testCaseName: "" }],
    },
  ]);
  const [reportModal, setReportModal] = useState(false);
  const [reportPayload, setReportPayload] = useState({ comparisonPayload: [], excelBase64: "" });

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleStep = (step) => () => setActiveStep(step);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const agentStorage = localStorage?.getItem("currAgent");
      const parsedAgentStorage = agentStorage ? JSON.parse(agentStorage) : {};
      const poDetails = parsedAgentStorage?.poData || {};
      const cpiDetails = parsedAgentStorage?.cpiData || {};
      const apiDetails = parsedAgentStorage?.apiData || {};

      const fileComparePayload = sections?.map((section, sectionIndex) => ({
        ...reportGenerate[sectionIndex],
        payload: section?.fileRows?.map((row, rowIndex) => ({
          requestFilename: row?.request?.name || "",
          responseFilename: row?.response?.name || "",
          testCaseName: row?.testCaseName || `Test Case ${rowIndex + 1}`,
        })),
      }));

      console.log(fileComparePayload);
      const payload = {
        poAgentDTO: poDetails,
        apiAgent: apiDetails,
        cpiAgent: cpiDetails,
        fileComparePayload,
      };

      const report = await generateReport(payload);
      if (report?.comparisonPayload) {
        setReportPayload({
          comparisonPayload: report.comparisonPayload,
          excelBase64: report.excelBase64,
        });
      }
      setLoading(false);
      setReportModal(true);
    } catch (error) {
      setLoading(false);
      console.error("Error in handleCompare:", error);
      // Handle the error as needed, e.g., show a notification or set an error state
    }
  };

  const resetForm = () => {
    setReportGenerate({});
    setGetICOS([]);
    setGetIflow([]);
    setSections([{ showMore: false, fileRows: [{ request: null, response: null, testCaseName: "" }] }]);
    setReportPayload({ comparisonPayload: [], excelBase64: "" });
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
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <Loader />
          </div>
        )}
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
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep === 0 && (
            <button
              className={`bg-[#0A6ED1] rounded-sm px-4 py-1 transition duration-200 ${
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
              onClick={handleCompare}
            >
              Compare
            </button>
          )}
        </Box>
      </div>

      {reportModal && (
        <ReportModal
          setReportModal={setReportModal}
          reportPayload={reportPayload}
          resetForm={resetForm}
        />
      )}
    </Box>
  );
};

export default AutomatedTesting;
