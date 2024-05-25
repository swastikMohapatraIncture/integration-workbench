/* eslint-disable react/prop-types */
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { postCPIData } from "../../../apis/apiService";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// const top100Films = [
//   { label: "The Shawshank Redemption", year: 1994 },
//   { label: "The Godfather", year: 1972 },
//   { label: "The Godfather: Part II", year: 1974 },
//   { label: "The Dark Knight", year: 2008 },
//   { label: "12 Angry Men", year: 1957 },
//   { label: "Schindler's List", year: 1993 },
//   { label: "Pulp Fiction", year: 1994 },
//   {
//     label: "The Lord of the Rings: The Return of the King",
//     year: 2003,
//   },
// ];

const agents = JSON.parse(localStorage.getItem("agents") || "[]");

const cpiDataNames = agents.map((agent) => ({ label: agent?.cpiData?.name }));

const system = [{ label: "DEV" }, { label: "QA" }, { label: "PROD" }];

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

const CPIDetails = ({
  showPassword,
  setShowPassword,
  setDisableNext,
  testingConn,
  // fileName,
  // setFileName,
  setTestingConn,
  // connectionMessage,
  // setConnectionMessage,
  // connectionStatus,
  // setConnectionStatus,
}) => {
  const [cpiData, setCpiData] = useState({});
  const [fileName, setFileName] = useState(null);
  // const [connectionStatus, setConnectionStatus] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const requiredFields = [
    "name",
    "clientId",
    "clientSecret",
    "tokenUrl",
    "url",
    "environment",
  ];

  const validateFields = () => {
    const allFieldsFilled = requiredFields.every((field) => cpiData[field]);
    setDisableNext(!allFieldsFilled);
    return allFieldsFilled;
  };

  useEffect(() => {
    validateFields();
  }, [cpiData]);

  const handleExistingChange = (e, value) => {
    const selectedAgent = agents.find((agent) => agent.cpiData.name === value?.label);
    if (selectedAgent) {
      setCpiData(selectedAgent.cpiData);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        fillFormFields(jsonData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        setFileName(null);
      }
    };
    fileReader.readAsText(file);
  };

  const fillFormFields = (data) => {
    const { oauth } = data;
    if (oauth) {
      const { clientid, clientsecret, url, tokenurl } = oauth;
      setCpiData((prevState) => ({
        ...prevState,
        clientId: clientid,
        clientSecret: clientsecret,
        url: url,
        tokenUrl: tokenurl,
      }));
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChangeInput = (value, name) => {
    setCpiData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChange = (e, name) => {
    setCpiData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleCPITest = (event) => {
    event.preventDefault();
    // setTestingConn(true);
    if (validateFields()) {
      setTestingConn(true);
      setErrorMessage("");
      postCPIData(
        cpiData,
        setDisableNext,
        setTestingConn,
        setConnectionMessage
      );
    } else {
      setErrorMessage("Please fill in all required fields.");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 text-sm gap-3 mb-2">
        <div className="flex flex-col">
          <span className="mb-2">Existing</span>
          <Autocomplete
            disablePortal
            size="small"
            id="combo-box-demo"
            onChange={handleExistingChange}
            options={cpiDataNames}
            getOptionLabel={(option) => option?.label || ""}
            getOptionValue={(option) => option?.label || ""}
            sx={{
              "& .MuiInputBase-input": { height: "1.2em", padding: "6px 12px" },
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select a name" />
            )}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Name</span>
          <TextField
            size="small"
            placeholder="Enter name"
            variant="outlined"
            value={cpiData?.name || ""}
            onChange={(e) => handleChange(e, "name")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4em", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Client ID</span>
          <TextField
            sx={{
              "& .MuiInputBase-input": { height: "1.4em", padding: "6px 12px" },
            }}
            value={cpiData?.clientId || ""}
            onChange={(e) => handleChange(e, "clientId")}
            size="small"
            placeholder="Enter Client ID"
            variant="outlined"
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Client Secret</span>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            sx={{
              "& .MuiInputBase-input": { height: "1.4em", padding: "6px 12px" },
            }}
            value={cpiData?.clientSecret || ""}
            onChange={(e) => handleChange(e, "clientSecret")}
            placeholder="Enter Client secret"
            size="small"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Token URL</span>
          <TextField
            size="small"
            placeholder="Token URL"
            variant="outlined"
            value={cpiData?.tokenUrl || ""}
            onChange={(e) => handleChange(e, "tokenUrl")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4em", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">URL</span>
          <TextField
            size="small"
            placeholder="URL"
            variant="outlined"
            value={cpiData?.url || ""}
            onChange={(e) => handleChange(e, "url")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4em", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Environment</span>
          <Autocomplete
            disablePortal
            size="small"
            id="combo-box-demo"
            onChange={(e, value) =>
              handleChangeInput(value?.label, "environment")
            }
            value={system.find((option) => option.label === cpiData?.environment) || null}
            options={system}
            getOptionLabel={(option) => option?.label || ""}
            getOptionValue={(option) => option?.label || ""}
            sx={{
              "& .MuiInputBase-input": { height: "1.2em", padding: "6px 12px" },
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select" />
            )}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Upload Security Key</span>
          <div className="flex flex-row">
            <TextField
              size="small"
              placeholder="No File chosen"
              variant="outlined"
              fullWidth
              value={fileName}
              onChange={handleFileUpload}
              sx={{
                "& .MuiInputBase-input": {
                  height: "1.4em",
                  padding: "6px 12px",
                },
              }}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Button
                      component="label"
                      variant="contained"
                      size="small"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        fontSize: "10px",
                        marginLeft: "-14px",
                        padding: "8px",
                      }}
                    >
                      Upload File
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      </div>
      <div className="mb-2 mt-4 flex flex-row gap-4 items-center">
        <button
          className="py-1 px-3 hover:bg-modalColor hover:text-white transition duration-2s rounded-md border border-modalColor text-modalColor"
          onClick={handleCPITest}
          disabled={testingConn}
        >
          {testingConn ? "Testing..." : "Test Connection"}
        </button>
        {errorMessage && <span className="text-red-500">{errorMessage}</span>}
        {connectionMessage.text && (
          <div className="flex items-center">
            {connectionMessage.type === "success" ? (
              <FaRegCheckCircle style={{ color: "green" }} />
            ) : (
              <ImCross style={{ color: "red" }} />
            )}
            <span
              className="ml-2"
              style={{
                color: connectionMessage.type === "success" ? "green" : "red",
              }}
            >
              {connectionMessage.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CPIDetails;
