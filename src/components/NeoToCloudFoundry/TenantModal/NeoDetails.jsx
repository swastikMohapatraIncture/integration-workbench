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

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
  {
    label: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
];

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
    "Integration_Host",
    "Oauth_Host",
    "Oauth_Clientid",
    "Oauth_Secret",
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

  const handleNeodetails = (event) => {
    event.preventDefault();
    if (validateFields()) {
      setTestingConn(true);
      setErrorMessage("");
      postNEOConnection(
        { formData: Neodetails },
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
            options={top100Films}
            onChange={(e, value) => handleChangeInput(value?.label, "existing")}
            getOptionLabel={(option) => option?.label || ""}
            getOptionValue={(option) => option?.label || ""}
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
            value={Neodetails?.Integration_Host || ""}
            onChange={(e) => handleChange(e, "Integration_Host")}
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
            value={Neodetails?.Oauth_Host || ""}
            onChange={(e) => handleChange(e, "Oauth_Host")}
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
            value={Neodetails?.Oauth_Clientid || ""}
            onChange={(e) => handleChange(e, "Oauth_Clientid")}
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
            value={Neodetails?.Oauth_Secret || ""}
            onChange={(e) => handleChange(e, "Oauth_Secret")}
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
            // onChange={(e, value) =>
            //   handleChangeInput(value?.label, "environment")
            // }
            // options={system}
            // getOptionLabel={(option) => option?.label || ""}
            // getOptionValue={(option) => option?.label || ""}
            // sx={{
            //   "& .MuiInputBase-input": { height: "1.2em", padding: "6px 12px" },
            // }}
            // // sx={{ width: 300 }}
            // renderInput={(params) => (
            //   <TextField {...params} placeholder="Select" />
            // )}
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
