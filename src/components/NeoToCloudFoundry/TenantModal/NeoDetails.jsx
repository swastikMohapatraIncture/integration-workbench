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
import { postNEOConnection } from "../../../apis/apiServiceNeo";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const tenants = JSON.parse(localStorage.getItem("tenants") || "[]");

const NeoDataNames = tenants?.map((tenant) => ({
  label: tenant?.NeoData?.name,
}));

const system = [{ label: "DEV" }, { label: "QA" }, { label: "PROD" }];

const NeoDetails = ({
  showPassword,
  setShowPassword,
  setDisableNext,
  testingConn,
  setTestingConn,
  currAgent,
  // connectionMessage,
  // setConnectionMessage,
  // connectionStatus,
  // setConnectionStatus,
}) => {
  const [Neodetails, setNeodetails] = useState(currAgent?.NeoData || {});
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const requiredFields = [
    "name",
    "integrationHost",
    "oauthHost",
    "oauthClientId",
    "oauthSecret",
    "environment",
  ];

  const validateFields = () => {
    const allFieldsFilled = requiredFields.every((field) => Neodetails[field]);
    // setDisableNext(!allFieldsFilled);
    return allFieldsFilled;
  };

  useEffect(() => {
    validateFields();
  }, [Neodetails]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChangeInput = (value, name) => {
    setNeodetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChange = (e, name) => {
    setNeodetails((prevState) => ({ ...prevState, [name]: e.target.value }));
    console.log(Neodetails);
  };

  const handleExistingChange = (e, value) => {
    const selectedNeoAgent = tenants.find(
      (tenant) => tenant.NeoData.name === value?.label
    );
    if (selectedNeoAgent) {
      setNeodetails(selectedNeoAgent.NeoData);
    }
  };

  const handleNeodetails = (event) => {
    event.preventDefault();
    if (validateFields()) {
      setTestingConn(true);
      setErrorMessage("");
      postNEOConnection(
        Neodetails,
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
            options={NeoDataNames}
            onChange={handleExistingChange}
            getOptionLabel={(option) => option?.label || ""}
            fullWidth
            sx={{
              "& .MuiInputBase-input": { height: "1.2em", padding: "6px 12px" },
            }}
            // sx={{ width: 300 }}
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
            value={Neodetails?.name || ""}
            onChange={(e) => handleChange(e, "name")}
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Integration Host</span>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter Host Name"
            variant="outlined"
            value={Neodetails?.integrationHost || ""}
            onChange={(e) => handleChange(e, "integrationHost")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Oauth Host</span>
          <TextField
            fullWidth
            size="small"
            placeholder="Oauth Host"
            variant="outlined"
            value={Neodetails?.oauthHost || ""}
            onChange={(e) => handleChange(e, "oauthHost")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Oauth Client Id</span>
          <TextField
            fullWidth
            size="small"
            placeholder="Oauth Client Id"
            variant="outlined"
            value={Neodetails?.oauthClientId || ""}
            onChange={(e) => handleChange(e, "oauthClientId")}
            sx={{
              "& .MuiInputBase-input": { height: "1.4", padding: "6px 12px" },
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Oauth Secret</span>
          <TextField
            size="small"
            placeholder="Oauth Secret"
            variant="outlined"
            value={Neodetails?.oauthSecret || ""}
            onChange={(e) => handleChange(e, "oauthSecret")}
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
            value={
              system.find(
                (option) => option.label === Neodetails?.environment
              ) || null
            }
            onChange={(e, value) =>
              handleChangeInput(value?.label, "environment")
            }
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
      </div>
      <div className="mb-2 mt-4 flex flex-row gap-4 items-center">
        <button
          className="py-1 px-3 hover:bg-modalColor hover:text-white transition duration-2s rounded-md border border-modalColor text-modalColor"
          onClick={handleNeodetails}
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

export default NeoDetails;
