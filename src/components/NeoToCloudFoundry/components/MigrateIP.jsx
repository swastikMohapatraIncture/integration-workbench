import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { PostPackages } from "../../../apis/apiServiceNeo";
import Loader from "../../Loader";
import { TextField, Autocomplete, Button, Box, Alert,Popper,Checkbox,ListItemText} from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';

const MigrateIP = ({ prepackages, custompackages }) => {
  const [prePackageOptions, setPrePackageOptions] = useState([]);
  const [customPackageOptions, setCustomPackageOptions] = useState([]);
  const [selectedPrePackages, setSelectedPrePackages] = useState([]);
  const [selectedCustomPackages, setSelectedCustomPackages] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Map prepackages and custompackages to options
    if (prepackages.length) {
      setPrePackageOptions(
        prepackages.map((pkg) => ({ value: pkg.Id, label: pkg.Name }))
      );
    }
    if (custompackages.length) {
      setCustomPackageOptions(
        custompackages.map((pkg) => ({ value: pkg.Id, label: pkg.Name }))
      );
    }
  }, [prepackages, custompackages]);

  const handleOptionChange = (event, value, setOptions) => {
    setOptions(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const postPack = await PostPackages(
        selectedPrePackages,
        selectedCustomPackages,
        setNotification
      );
      console.log("Post Package value: ", postPack);
      // if (postPack) {
      //   setNotification({
      //     open: true,
      //     message: "Migration completed successfully!",
      //     severity: "success",
      //   });
      // } else {
      //   setNotification({
      //     open: true,
      //     message: "Migration failed. Please check the console for details.",
      //     severity: "error",
      //   });
      // }
    } catch (error) {
      setNotification({
        open: true,
        message: "Migration failed. Please check the console for details.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setNotification({ ...notification, open: false });
    }, 9000); // Set timeout to 9 seconds
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const isButtonVisible =
    selectedPrePackages.length > 0 || selectedCustomPackages.length > 0;

  return (
    <div className="m-4 space-y-8">
      <div
        style={{ position: "relative", filter: loading ? "blur(5px)" : "none" }}
      >
        <h4 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
          Pre Packages
        </h4>
        <div className="w-full mb-5">
          <Autocomplete
      multiple
      disableCloseOnSelect
      options={prePackageOptions}
      getOptionLabel={(option) => option.label}
      onChange={(event, value) => setSelectedPrePackages(value)}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBox fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          <ListItemText primary={option.label} />
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Custom-Packages (SAP Integration)" placeholder="Custom-Packages (SAP Integration)" />
      )}
      value={selectedPrePackages}
      PopperComponent={(popperProps) => (
        <Popper {...popperProps} placement="bottom-start" className="mt-4" />
      )}
    />
          {selectedPrePackages.length > 0 && (
            <div>
              {/* Table for selected options */}
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPrePackages.map((option) => (
                    <tr key={option.value}>
                      <td className="border border-gray-300 px-4 py-2">
                        {option.value}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {option.label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <h4 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
          Custom Packages
        </h4>
        <div className="w-full">
           <Autocomplete
      multiple
      disableCloseOnSelect
      options={customPackageOptions}
      getOptionLabel={(option) => option.label}
      onChange={(event, value) => setSelectedCustomPackages(value)}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBox fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          <ListItemText primary={option.label} />
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Custom-Packages (SAP Integration)" placeholder="Custom-Packages (SAP Integration)" />
      )}
      value={selectedCustomPackages}
      PopperComponent={(popperProps) => (
        <Popper {...popperProps} placement="bottom-start" className="mt-4" />
      )}
    />
          {selectedCustomPackages.length > 0 && (
            <div>
              {/* Table for selected options */}
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomPackages.map((option) => (
                    <tr key={option.value}>
                      <td className="border border-gray-300 px-4 py-2">
                        {option.value}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {option.label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {isButtonVisible && (
          <Box display="flex" justifyContent="flex-end" mt={2} mr={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
        )}
      </div>
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          top="1%"
          bottom="1%"
          left="1%"
          right="1%"
          zIndex={999}
        >
          <Loader />
        </Box>
      )}
      {notification.open && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          bottom={100}
          left="40%"
          transform="translateX(-50%)"
          zIndex={9999}
        >
          <Alert
            severity={notification.severity}
            onClose={handleCloseNotification}
          >
            {notification.message}
          </Alert>
        </Box>
      )}
    </div>
  );
};

MigrateIP.propTypes = {
  prepackages: PropTypes.array.isRequired,
  custompackages: PropTypes.array.isRequired,
};

export default MigrateIP;
