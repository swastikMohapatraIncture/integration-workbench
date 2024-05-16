import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Autocomplete, IconButton, InputAdornment, OutlinedInput, TextField } from "@mui/material";
import { useState } from "react";

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

const PODetails = () => {
    const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
              <TextField  {...params} placeholder="Select a name" />
            )}
          />
        </div>
        <div className="flex flex-col">
          <span>Name</span>
          <TextField size="small" placeholder="Enter name" variant="outlined" />
        </div>
        <div className="flex flex-col">
          <span>Username</span>
          <TextField size="small" placeholder="Enter User name" variant="outlined" />
        </div>
        <div className="flex flex-col">
          <span>Password</span>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter placeholder"
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
          <span>Host</span>
          <TextField size="small" placeholder="ex.SAP_Server" variant="outlined" />
        </div>
        <div className="flex flex-col">
          <span>Port</span>
          <TextField size="small" placeholder="ex.5050" variant="outlined" />
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
              <TextField  {...params} placeholder="Select" />
            )}
          />
        </div>
       
      </div>
      <div className="mb-2">
        <button
            className="py-1 px-3 hover:bg-modalColor hover:text-white transition duration-2s rounded-md border border-modalColor text-modalColor"
          >
            Test connection
          </button>
        </div>
    </div>
  );
};

export default PODetails;
