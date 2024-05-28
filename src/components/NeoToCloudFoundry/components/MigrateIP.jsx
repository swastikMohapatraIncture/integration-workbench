import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const MigrateIP = () => {
  const options = [
    { value: 'Option 1', label: 'SAP Integration Package 1' },
    { value: 'Option 2', label: 'SAP Integration Package 2' },
    { value: 'Option 3', label: 'SAP Integration Package 3' },
  ];

  const [selectedOptions1, setSelectedOptions1] = useState([]);
  const [selectedOptions2, setSelectedOptions2] = useState([]);

  const handleOptionChange = (event, value, setOptions) => {
    setOptions(value);
  };

  const dummyData = [
    { id: 1, column1: 'Data 1', column2: 'Data A' },
    { id: 2, column1: 'Data 2', column2: 'Data B' },
    { id: 3, column1: 'Data 3', column2: 'Data C' },
  ];

  return (
    <div className="m-4 space-y-8">
      <div className="w-full">
        <Autocomplete
          multiple
          options={options}
          value={selectedOptions1}
          onChange={(event, value) => handleOptionChange(event, value, setSelectedOptions1)}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Pre-Packages (SAP Integration)" />}
          PopperProps={{
            className: "mt-4", // Adjust this value as needed
          }}
        />
        {selectedOptions1.length > 0 && (
          <div>
            {/* Table for selected options */}
            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Column 1</th>
                  <th className="border border-gray-300 px-4 py-2">Column 2</th>
                </tr>
              </thead>
              <tbody>
                {selectedOptions1.map((option) => (
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
      <div className="w-full">
        <Autocomplete
          multiple
          options={options}
          value={selectedOptions2}
          onChange={(event, value) => handleOptionChange(event, value, setSelectedOptions2)}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Custom-Packages (SAP Integration)" />}
          PopperProps={{
            className: "mt-4", // Adjust this value as needed
          }}
        />
        {selectedOptions2.length > 0 && (
          <div>
            {/* Table for selected options */}
            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Column 1</th>
                  <th className="border border-gray-300 px-4 py-2">Column 2</th>
                </tr>
              </thead>
              <tbody>
                {selectedOptions2.map((option) => (
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
    </div>
  );
};

export default MigrateIP;
