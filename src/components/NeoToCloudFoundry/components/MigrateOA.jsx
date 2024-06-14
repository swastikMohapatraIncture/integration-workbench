import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Button, Box, Alert } from '@mui/material';
import { Link } from "react-router-dom";

const MigrateOA = () => {
  const [numberRanges, setnumberRanges] = useState([]);
  const [selectedNumberRange, setSelectedNumberRange] = useState(null);

  const [variables, setvariables] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState(null);

  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    // Fetch number ranges from API
    const fetchNumberRanges = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/v1/migration/Get/NumberRanges');
        const data = await response.json();
        setnumberRanges(data.d.results);
        console.log(numberRanges);
      } catch (error) {
        console.error('Error fetching number ranges:', error);
      }
    };

      // Fetch variables from API
      const fetchVariables = async () => {
        try {
          const response = await fetch('http://localhost:8082/api/v1/migration/get/variables');
          const data = await response.json();
          setvariables(data.d.results);
          console.log(variables);
        } catch (error) {
          console.error('Error fetching variables:', error);
        }
      };
  
      fetchNumberRanges();
      fetchVariables();
  }, []);

  const handleSubmit = async () => {
    if (selectedNumberRange) {
      try {
        const response = await fetch(
          `http://localhost:8082/api/v1/migration/Upload/NumberRanges?NumberRangeName=${selectedNumberRange.Name}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          setNotification({
            open: true,
            message: 'Number range uploaded successfully',
            severity: 'success',
          });
        } else {
          setNotification({
            open: true,
            message: 'Number Range already exist',
            severity: 'error',
          });
        }
      } catch (error) {
        console.error('Error uploading number range:', error);
        setNotification({
          open: true,
          message: 'An error occurred while uploading the number range',
          severity: 'error',
        });
      }
    }
    if (selectedVariable) {
      try {
        console.log(selectedVariable.VariableName);
        const response = await fetch(
          `http://localhost:8082/api/v1/migration/upload/variables?VariableName=${selectedVariable.VariableName}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(response);
        if (response.ok) {
          setNotification({
            open: true,
            message: 'Variable uploaded successfully',
            severity: 'success',
          });
        } else {
          setNotification({
            open: true,
            message: 'Variable already exists',
            severity: 'error',
          });
        }
      } catch (error) {
        console.error('Error uploading variable:', error);
        setNotification({
          open: true,
          message: 'An error occurred while uploading the variable',
          severity: 'error',
        });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <div className="m-4 space-y-8 mb-5">
        <h4 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
          Number Ranges
        </h4>
        
        <Autocomplete
          options={numberRanges}
          getOptionLabel={(option) => option.Name}
          onChange={(event, value) => setSelectedNumberRange(value)}
          renderInput={(params) => (
            <TextField {...params} label="Select Number Range" />
          )}
          PopperProps={{
            className: "mt-4", // Adjust this value as needed
          }}
        />
        
        {selectedNumberRange && (
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
              Selected Number Range Details:
            </h3>
            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    {selectedNumberRange.Name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {selectedNumberRange.Description}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
         <div>
          <h4 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
            Variables
          </h4>
          
          <Autocomplete
            options={variables}
            getOptionLabel={(option) => option.VariableName}
            onChange={(event, value) => setSelectedVariable(value)}
            renderInput={(params) => (
              <TextField {...params} label="Select Variable" />
            )}
            PopperProps={{
              className: "mt-4",
            }}
          />
          
          {selectedVariable && (
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
                Selected Variable Details:
              </h3>
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Integration Flow</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      {selectedVariable.VariableName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {selectedVariable.IntegrationFlow}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>
        {(selectedNumberRange || selectedVariable)&& (
          <div className="flex justify-end">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit}
              className="mt-4"
            >
              Submit
            </Button>
            
          </div>
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
      
    </>
  );
};

export default MigrateOA;
