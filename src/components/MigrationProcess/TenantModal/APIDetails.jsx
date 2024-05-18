import  { useState } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  OutlinedInput,
  styled,
  Autocomplete,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon, Visibility, VisibilityOff } from "@mui/icons-material";

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

const APIDetails = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="grid grid-cols-2 text-sm gap-3 mb-2">
        <div className="flex flex-col">
          <span className="mb-2">Name</span>
          <TextField size="small" placeholder="Enter name" variant="outlined" sx={{ '& .MuiInputBase-input': { height: '1.4', padding: '6px 12px' } }}/>
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Client ID</span>
          <TextField
            size="small"
            placeholder="Enter Client ID"
            variant="outlined"
            sx={{ '& .MuiInputBase-input': { height: '1.4', padding: '6px 12px' } }}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Client Secret</span>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Client secret"
            size="small"
            sx={{ '& .MuiInputBase-input': { height: '1.4', padding: '6px 12px' } }}
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
          <TextField size="small" placeholder="Token URL" variant="outlined" sx={{ '& .MuiInputBase-input': { height: '1.4', padding: '6px 12px' } }}/>
        </div>
        <div className="flex flex-col">
          <span className="mb-2">URL</span>
          <TextField size="small" placeholder="URL" variant="outlined" sx={{ '& .MuiInputBase-input': { height: '1.4', padding: '6px 12px' } }}/>
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Environment</span>
          <Autocomplete
            disablePortal
            size="small"
            id="combo-box-demo"
            options={top100Films}
            sx={{ '& .MuiInputBase-input': { height: '1.2em', padding: '6px 12px' } }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select" />
            )}
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-2">Upload Security Key</span>
          <TextField
            size="small"
            placeholder="No File chosen"
            variant="outlined"
            value={fileName}
            sx={{ '& .MuiInputBase-input': { height: '1.4', padding: '6px 12px' } }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Button
                    component="label"
                    variant="contained"
                    size="small"
                    startIcon={<CloudUploadIcon />}
                    sx={{ fontSize: "10px", marginLeft:"-13px", padding:"8px" }}
                  >
                    Upload File
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
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

export default APIDetails;
