/* eslint-disable react/prop-types */
import {
  Autocomplete,
  TextField,
  Collapse,
  styled,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import {
  getIFlows,
  handleIcoList,
  postFileCompareApi,
} from "../../apis/apiService";
import { FaPlus } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AutomatedForm = ({
  getICOS,
  setGetICOS,
  getIFlow,
  setGetIflow,
  reportGenerate,
  setReportGenerate,
  sections,
  setSections,
}) => {
  // const [sections, setSections] = useState([
  //   {
  //     showMore: false,
  //     fileRows: [{ request: null, response: null }],
  //   },
  // ]);
  

  const addNewSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      {
        showMore: false,
        fileRows: [{ request: null, response: null }],
      },
    ]);
  };

  const handleFileChange = async (event, type, sectionIndex, fileIndex) => {
    const file = event.target.files[0];
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fileRows[fileIndex][type] = file;
    setSections(updatedSections);
  
    const xmlFile1 = updatedSections[sectionIndex]?.fileRows?.map((row) => row?.request);
    const xmlFile2 = updatedSections[sectionIndex]?.fileRows?.map((row) => row?.response);
  
    // Check if both xmlFile1 and xmlFile2 contain at least one file each
    const hasFilesInBothArrays = xmlFile1.some(file => file) && xmlFile2.some(file => file);
  
    if (hasFilesInBothArrays) {
      try {
        const response = await postFileCompareApi({ xmlFile1, xmlFile2 });
        console.log("Upload response:", response);
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }
  };
  

  const handleFileRemove = (type, sectionIndex, fileIndex) => {
    setSections((prevSections) =>
      prevSections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              fileRows: section.fileRows.map((row, rIndex) =>
                rIndex === fileIndex ? { ...row, [type]: null } : row
              ),
            }
          : section
      )
    );
  };

  const addNewRow = (sectionIndex) => {
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              fileRows: [
                ...section.fileRows,
                { request: null, response: null },
              ],
            }
          : section
      )
    );
  };

  const deleteSection = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections.splice(sectionIndex, 1);
    setSections(updatedSections);
  };

  const sharedStyles = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: 1,
    padding: "4px 9px",
    textTransform: "capitalize",
    width: "220px",
  };

  useEffect(() => {
    const fetchICOList = async () => {
      const agentStorage = localStorage?.getItem("currAgent");
      const agentData = agentStorage ? JSON.parse(agentStorage)?.poData : {};

      try {
        const response = await handleIcoList(agentData);
        const keys = response || [];
        const options = keys.map((key) => ({ label: key }));
        setGetICOS(options);
      } catch (error) {
        console.error("Error fetching ICO list:", error);
      }
    };

    fetchICOList();
  }, []);

  useEffect(() => {
    const fetchIFlowID = async () => {
      const agentStorage = localStorage?.getItem("currAgent");
      const agentData = agentStorage ? JSON.parse(agentStorage)?.apiData : {};

      try {
        const response = await getIFlows(agentData);
        setGetIflow(response);
      } catch (error) {
        console.error("Error fetching ICO list:", error);
      }
    };

    fetchIFlowID();
  }, []);

  const handleChangeInput = (value, name, field, sectionIndex) => {
    const fieldValue = field === "icoKey" ? value?.label : value?.name || "";
    setReportGenerate((prevState) => ({
      ...prevState,
      [sectionIndex]: {
        ...prevState[sectionIndex],
        [name]: fieldValue,
      },
    }));
  };

  // const handleChange = (e, name, sectionIndex) => {
  //   setReportGenerate((prevState) => ({
  //     ...prevState,
  //     [sectionIndex]: {
  //       ...prevState[sectionIndex],
  //       [name]: e.target.value,
  //     },
  //   }));
  // };

  return (
    <div>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="border p-4 rounded mb-4">
          <div className="grid grid-cols-2 text-sm gap-3 mb-2">
            <div className="flex flex-col">
              <span className="mb-2">Select ICO</span>
              <Autocomplete
                disablePortal
                // freeSolo
                size="small"
                id={`combo-box-ico-${sectionIndex}`}
                options={getICOS}
                onChange={(e, value) =>
                  handleChangeInput(value, "icoKey", "icoKey", sectionIndex)
                }
                sx={{
                  "& .MuiInputBase-input": {
                    height: "1.2em",
                    padding: "6px 12px",
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="ICO" />
                )}
              />
            </div>
            <div className="flex flex-col">
              <span className="mb-2">Select iFlow</span>
              <Autocomplete
                disablePortal
                // freeSolo
                size="small"
                id={`combo-box-iflow-${sectionIndex}`}
                options={getIFlow}
                onChange={(e, value) =>
                  handleChangeInput(value, "iflowId", "iflowId", sectionIndex)
                }
                getOptionLabel={(option) => option?.name || ""}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "1.2em",
                    padding: "6px 12px",
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="iFlow" />
                )}
              />
            </div>
          </div>
          <div>
            <div className="flex gap-4 justify-end">
              <button
                className="text-[#0064D9]"
                onClick={() => {
                  const updatedSections = [...sections];
                  updatedSections[sectionIndex].showMore =
                    !updatedSections[sectionIndex]?.showMore;
                  setSections(updatedSections);
                }}
              >
                {section.showMore ? "Show less" : "Show More "}
              </button>
              <button className="text-red-700" onClick={deleteSection}>
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
            <Collapse in={section.showMore}>
              {section.fileRows.map((row, fileIndex) => (
                <div
                  key={fileIndex}
                  className="flex flex-row justify-start gap-8 items-center mt-2"
                >
                  <div>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={row.testCaseName}
                      onChange={(e) => {
                        const updatedSections = [...sections];
                        updatedSections[sectionIndex].fileRows[
                          fileIndex
                        ].testCaseName = e.target.value;
                        setSections(updatedSections);
                      }}
                      placeholder={`Test Case ${fileIndex + 1}`}
                    />
                  </div>
                  <div>
                    <Box>
                      {!row.request ? (
                        <Button
                          component="label"
                          variant="outlined"
                          sx={{ ...sharedStyles }}
                          startIcon={<MdOutlineFileUpload />}
                        >
                          Upload Request
                          <VisuallyHiddenInput
                            type="file"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                "request",
                                sectionIndex,
                                fileIndex
                              )
                            }
                          />
                        </Button>
                      ) : (
                        <Box sx={{ ...sharedStyles }}>
                          <Typography sx={{ flexGrow: 1 }}>
                            {row?.request?.name}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleFileRemove(
                                "request",
                                sectionIndex,
                                fileIndex
                              )
                            }
                            size="small"
                          >
                            <IoCloseCircleOutline />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </div>
                  <div>
                    <Box>
                      {!row.response ? (
                        <Button
                          component="label"
                          variant="outlined"
                          sx={{ ...sharedStyles }}
                          startIcon={<MdOutlineFileUpload />}
                        >
                          Upload Response
                          <VisuallyHiddenInput
                            type="file"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                "response",
                                sectionIndex,
                                fileIndex
                              )
                            }
                          />
                        </Button>
                      ) : (
                        <Box sx={{ ...sharedStyles }}>
                          <Typography sx={{ flexGrow: 1 }}>
                            {row.response?.name}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleFileRemove(
                                "response",
                                sectionIndex,
                                fileIndex
                              )
                            }
                            size="small"
                          >
                            <IoCloseCircleOutline />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </div>
                </div>
              ))}
              <div className="flex justify-end items-end mt-2">
                <button
                  className={`text-sm text-[#0064D9] ${
                    section.fileRows.length > 0 &&
                    !section.fileRows.every(
                      (row) => row?.request && row?.response
                    )
                      ? "cursor-not-allowed text-[#76a9e4]"
                      : "cursor-pointer"
                  }`}
                  onClick={() => addNewRow(sectionIndex)}
                  disabled={
                    section.fileRows.length > 0 &&
                    !section.fileRows.every(
                      (row) => row.request && row.response
                    )
                  }
                >
                  &#43; Add more files
                </button>
              </div>
            </Collapse>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-4 border-dashed border-2 border-[#0A6ED1] p-4 ]">
        <Button variant="outlined" color="primary" onClick={addNewSection}>
          <FaPlus />
        </Button>
      </div>
    </div>
  );
};

export default AutomatedForm;
