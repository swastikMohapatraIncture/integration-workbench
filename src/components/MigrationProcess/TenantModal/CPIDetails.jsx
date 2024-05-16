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
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

const CPIDetails = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState("");
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file?.name);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="flex flex-col">
          <span>Existing</span>
          <Autocomplete
            disablePortal
            size="small"
            id="combo-box-demo"
            options={top100Films}
            // sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select a name" />
            )}
          />
        </div>
        <div className="flex flex-col">
          <span>Name</span>
          <TextField size="small" placeholder="Enter name" variant="outlined" />
        </div>
        <div className="flex flex-col">
          <span>Client ID</span>
          <TextField
            size="small"
            placeholder="Enter Client ID"
            variant="outlined"
          />
        </div>
        <div className="flex flex-col">
          <span>Client Secret</span>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
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
          <span>Token URL</span>
          <TextField size="small" placeholder="Token URL" variant="outlined" />
        </div>
        <div className="flex flex-col">
          <span>URL</span>
          <TextField size="small" placeholder="URL" variant="outlined" />
        </div>
        <div className="flex flex-col">
          <span>Environment</span>
          <Autocomplete
            disablePortal
            size="small"
            id="combo-box-demo"
            options={top100Films}
            // sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select" />
            )}
          />
        </div>
        <div className="flex flex-col">
          <span>Upload Security Key</span>
          <div className="flex flex-row">
          <Button
            component="label"
            variant="contained"
            size="small"
            startIcon={<CloudUploadIcon />}
            sx={{width:"150px", fontSize:"10px"}}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          <TextField
            size="small"
            placeholder="URL"
            variant="outlined"
            value={fileName} 
            InputProps={{
              readOnly: true, 
            }}
          />
          </div>
        </div>
      </div>
      <div className="mb-2 mt-4">
        <button className="py-1 px-3 hover:bg-modalColor hover:text-white transition duration-2s rounded-md border border-modalColor text-modalColor">
          Test connection
        </button>
      </div>
    </div>
  );
};

export default CPIDetails;
