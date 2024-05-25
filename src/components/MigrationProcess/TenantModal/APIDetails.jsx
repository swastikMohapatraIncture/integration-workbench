/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  OutlinedInput,
  styled,
  Autocomplete,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { postAPIData } from "../../../apis/apiService";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";

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

const APIDetails = ({
  showPassword,
  setShowPassword,
  setDisableNext,
  testingConn,
  setTestingConn,
}) => {
  const [apiData, setApiData] = useState({
    name: "",
    clientId: "",
    clientSecret: "",
    tokenUrl: "",
    url: "",
    environment: "",
  });
  const [fileName, setFileName] = useState(null);
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
    const allFieldsFilled = requiredFields.every((field) => apiData[field]);
    setDisableNext(!allFieldsFilled);
    return allFieldsFilled;
  };

  useEffect(() => {
    validateFields();
  }, [apiData]);

  // Fetch name and environment from localStorage on mount
  useEffect(() => {
    const currAgent = localStorage.getItem("currAgent");
    if (currAgent) {
      const parsedAgent = JSON.parse(currAgent);
      const { name, environment } = parsedAgent.cpiData || {};
      setApiData((prevState) => ({
        ...prevState,
        name: name || "",
        environment: environment || "",
      }));
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      handleFileUpload(file);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChangeInput = (value, name) => {
    setApiData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChange = (e, name) => {
    setApiData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleAPITest = (event) => {
    event.preventDefault();
    if (validateFields()) {
      setTestingConn(true);
      setErrorMessage("");
      postAPIData(apiData, setDisableNext, setTestingConn, setConnectionMessage);
    } else {
      setErrorMessage("Please fill in all required fields.");
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
      setApiData((prevState) => ({
        ...prevState,
        clientId: clientid,
        clientSecret: clientsecret,
        url: url,
        tokenUrl: tokenurl,
      }));
    } else {
      console.error("Invalid JSON structure:", data);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 text-sm gap-3 mb-2">
        <div className="flex flex-col">
          <span className="mb-2">Name</span>
          <TextField
            size="small"
            placeholder="Enter name"
            variant="outlined"
            value={apiData?.name || ""}
            onChange={(e) => handleChange(e, "name")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4em", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Client ID</span>
          <TextField
            size="small"
            placeholder="Enter Client ID"
            value={apiData?.clientId || ""}
            onChange={(e) => handleChange(e, "clientId")}
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": { height: "1.4em", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Client Secret</span>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Client secret"
            value={apiData?.clientSecret || ""}
            onChange={(e) => handleChange(e, "clientSecret")}
            size="small"
            sx={{
              "& .MuiInputBase-input": { height: "1.4em", padding: "6px 12px" },
            }}
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
            value={apiData?.tokenUrl || ""}
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
            value={apiData?.url || ""}
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
            options={system}
            value={system.find(
              (option) => option.label === apiData?.environment
            ) || null} // Ensure the value is correctly matched
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
        <div className="flex flex-row">
          <TextField
            size="small"
            placeholder="No File chosen"
            variant="outlined"
            fullWidth
            value={fileName || ""}
            sx={{
              "& .MuiInputBase-input": { height: "1.4em", padding: "6px 12px" },
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
      <div className="mb-2 mt-4 flex flex-row gap-4 items-center">
        <button
          className="py-1 px-3 hover:bg-modalColor hover:text-white transition duration-2s rounded-md border border-modalColor text-modalColor"
          onClick={handleAPITest}
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

export default APIDetails;
