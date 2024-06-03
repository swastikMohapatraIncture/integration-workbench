import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const MigrationComponent = () => {
  // Dummy options for demonstration purposes
  const prePackageOptions = [
    { label: 'Pre-Package 1', value: '1' },
    { label: 'Pre-Package 2', value: '2' },
    { label: 'Pre-Package 3', value: '3' },
  ];

  const customPackageOptions = [
    { label: 'Custom Package 1', value: '101' },
    { label: 'Custom Package 2', value: '102' },
    { label: 'Custom Package 3', value: '103' },
  ];

  // State for selected packages
  const [selectedPrePackages, setSelectedPrePackages] = useState([]);
  const [selectedCustomPackages, setSelectedCustomPackages] = useState([]);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  // Handler for option changes
  const handleOptionChange = (event, value, setter) => {
    setter(value);
  };

  // Dummy function for post packages
  const PostPackages = (prePackages, customPackages) => {
    console.log('Selected Pre-Packages:', prePackages);
    console.log('Selected Custom-Packages:', customPackages);
    // Here you can add your logic to post the selected packages
  };

  return (
    <div className="m-4 space-y-8">
      <h4 className="text-lg font-semibold mb-4" style={{ color: '#2A4862' }}>Package Name</h4>
      <div className="w-full">
        <Autocomplete
          multiple
          options={prePackageOptions}
          value={selectedPrePackages}
          onChange={(event, value) => handleOptionChange(event, value, setSelectedPrePackages)}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Artifacts (SAP Integration)" />}
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
                    <td className="border border-gray-300 px-4 py-2">{option.value}</td>
                    <td className="border border-gray-300 px-4 py-2">{option.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {isButtonVisible && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Link to="/getartifacts">
            <Button variant="contained" color="primary" onClick={() => { PostPackages(selectedPrePackages, selectedCustomPackages) }}>
              Submit
            </Button>
          </Link>
        </Box>
      )}
    </div>
  );
};

export default MigrationComponent;
