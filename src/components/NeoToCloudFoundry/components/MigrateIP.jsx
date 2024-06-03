import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { PostPackages } from "../../../apis/apiServiceNeo";

const MigrateIP = ({ prepackages, custompackages }) => {
  const [prePackageOptions, setPrePackageOptions] = useState([]);
  const [customPackageOptions, setCustomPackageOptions] = useState([]);
  const [selectedPrePackages, setSelectedPrePackages] = useState([]);
  const [selectedCustomPackages, setSelectedCustomPackages] = useState([]);

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

  const isButtonVisible =
    selectedPrePackages.length > 0 || selectedCustomPackages.length > 0;

  return (
    <div className="m-4 space-y-8">
      <h4 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
        Pre Packages
      </h4>
      <div className="w-full">
        <Autocomplete
          multiple
          options={prePackageOptions}
          value={selectedPrePackages}
          onChange={(event, value) =>
            handleOptionChange(event, value, setSelectedPrePackages)
          }
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Pre-Packages (SAP Integration)" />
          )}
          PopperProps={{
            className: "mt-4", // Adjust this value as needed
          }}
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
      {/* <div class="w-full flex justify-center">
  <hr class="my-4 border-t-2 border-gray-300 w-1/2" />
</div> */}

      <h4 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
        Custom Packages
      </h4>
      <div className="w-full">
        <Autocomplete
          multiple
          options={customPackageOptions}
          value={selectedCustomPackages}
          onChange={(event, value) =>
            handleOptionChange(event, value, setSelectedCustomPackages)
          }
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Custom-Packages (SAP Integration)" />
          )}
          PopperProps={{
            className: "mt-4", // Adjust this value as needed
          }}
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
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              PostPackages(selectedPrePackages, selectedCustomPackages);
            }}
          >
            Submit
          </Button>
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
