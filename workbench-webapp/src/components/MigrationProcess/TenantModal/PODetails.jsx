/* eslint-disable react/prop-types */
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { postESRConnection } from "../../../apis/apiService";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Assuming you have already stored this data in localStorage
const agents = JSON.parse(localStorage.getItem("agents") || "[]");

const poDataNames = agents?.map((agent) => ({ label: agent?.poData?.name }));

const system = [{ label: "DEV" }, { label: "QA" }, { label: "PROD" }];

const PODetails = ({
  showPassword,
  setShowPassword,
  setDisableNext,
  testingConn,
  setTestingConn,
  currAgent
}) => {
  const [poDetails, setPoDetails] = useState(currAgent?.poData || {});
  const [connectionMessage, setConnectionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const allFields = [
    "name",
    "username",
    "password",
    "host",
    "port",
    "environment",
    "destinationName"
  ];

  const requiredFields = ["name", "environment", "destinationName"];

  const ensureFieldsAreFilled = () => {
    const updatedPoDetails = { ...poDetails };
    allFields.forEach((field) => {
      if (!updatedPoDetails[field]) {
        updatedPoDetails[field] = "";
      }
    });
    setPoDetails(updatedPoDetails);
  };

  const validateFields = () => {
    return requiredFields.every((field) => poDetails[field]);
  };

  useEffect(() => {
    ensureFieldsAreFilled();
  }, [poDetails]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChangeInput = (value, name) => {
    setPoDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChange = (e, name) => {
    setPoDetails((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleExistingChange = (e, value) => {
    const selectedAgent = agents.find((agent) => agent.poData.name === value?.label);
    if (selectedAgent) {
      setPoDetails(selectedAgent.poData);
    }
  };

  const handlePODetails = (event) => {
    event.preventDefault();
    ensureFieldsAreFilled();
    if (validateFields()) {
      setTestingConn(true);
      setErrorMessage("");
      postESRConnection(
        poDetails,
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
            options={poDataNames}
            onChange={handleExistingChange}
            getOptionLabel={(option) => option.label}
            fullWidth
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
            fullWidth
            size="small"
            placeholder="Enter name"
            value={poDetails?.name || ""}
            onChange={(e) => handleChange(e, "name")}
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="hidden flex-col">
          <span className="mb-2">Username</span>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter User name"
            variant="outlined"
            value={poDetails?.username || ""}
            onChange={(e) => handleChange(e, "username")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="hidden flex-col">
          <span className="mb-2">Password</span>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            fullWidth
            size="small"
            value={poDetails?.password || ""}
            onChange={(e) => handleChange(e, "password")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
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
        <div className="hidden flex-col">
          <span className="mb-2">Host</span>
          <TextField
            fullWidth
            size="small"
            placeholder="ex.SAP_Server"
            variant="outlined"
            value={poDetails?.host || ""}
            onChange={(e) => handleChange(e, "host")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="hidden flex-col">
          <span className="mb-2">Port</span>
          <TextField
            size="small"
            placeholder="ex.5050"
            variant="outlined"
            value={poDetails?.port || ""}
            onChange={(e) => handleChange(e, "port")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Environment</span>
          <Autocomplete
            disablePortal
            size="small"
            id="combo-box-demo"
            fullWidth
            value={system.find((option) => option.label === poDetails?.environment) || null}
            onChange={(e, value) => handleChangeInput(value?.label, "environment")}
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
          <span className="mb-2">Destination</span>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter destination name"
            value={poDetails?.destinationName || ""}
            onChange={(e) => handleChange(e, "destinationName")}
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
            }}
          />
        </div>
      </div>
      <div className="mb-2 mt-4 flex flex-row gap-4 items-center">
        <button
          className="py-1 px-3 hover:bg-modalColor hover:text-white transition duration-2s rounded-md border border-modalColor text-modalColor"
          onClick={handlePODetails}
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

export default PODetails;
