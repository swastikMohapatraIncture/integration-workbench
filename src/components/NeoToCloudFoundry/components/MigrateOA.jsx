import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Alert,
  Popper,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Loader from "../../Loader";
import {
  fetchDataStores,
  fetchNumberRanges,
  fetchVariables,
  postCustomTags,
  postDataStore,
  postNumberRanges,
  postVariables,
} from "../../../apis/apiServiceNeo";

const MigrateOA = () => {
  const [numberRanges, setNumberRanges] = useState([]);
  const [selectedNumberRange, setSelectedNumberRange] = useState([]);

  const [variables, setVariables] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState([]);

  const [dataStores, setDataStores] = useState([]);
  const [selectedDataStore, setSelectedDataStore] = useState([]);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [loading, setLoading] = useState(false);

  const [customTagsCheckbox, setCustomTagsCheckbox] = useState(false);

  useEffect(() => {
    fetchNumberRanges(setNumberRanges);
    fetchVariables(setVariables);
    fetchDataStores(setDataStores);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const promises = [];

      // Handle number range submission
      if (selectedNumberRange.length > 0) {
        promises.push(postNumberRanges(selectedNumberRange, setNotification));
      }

      // Handle variable submission
      if (selectedVariable.length > 0) {
        promises.push(postVariables(selectedVariable, setNotification));
      }

      // Handle data store submission
      if (selectedDataStore.length > 0) {
        promises.push(postDataStore(selectedDataStore, setNotification));
      }

      // Handle Customtags API call
      if (customTagsCheckbox) {
        promises.push(postCustomTags(setNotification));
      }

      // Execute all promises concurrently
      await Promise.all(promises);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <div className="m-4 space-y-8 mb-5">
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
        <div
          style={{
            position: "relative",
            filter: loading ? "blur(5px)" : "none",
          }}
        >
          <h4
            className="text-lg font-semibold mb-4"
            style={{ color: "#2A4862" }}
          >
            Number Ranges
          </h4>

          <Autocomplete
            multiple
            disableCloseOnSelect
            options={numberRanges}
            getOptionLabel={(option) => option.Name}
            onChange={(event, value) => setSelectedNumberRange(value)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlank fontSize="small" />}
                  checkedIcon={<CheckBox fontSize="small" />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                <ListItemText primary={option.Name} />
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Number Ranges" />
            )}
            value={selectedNumberRange}
            PopperComponent={(popperProps) => (
              <Popper
                {...popperProps}
                placement="bottom-start"
                className="mt-4"
              />
            )}
          />

          {selectedNumberRange.length > 0 && (
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#2A4862" }}
              >
                Selected Number Range Details:
              </h3>
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th
                      className="border border-gray-300 px-4 py-2 "
                      style={{ width: "19%" }}
                    >
                      Name
                    </th>
                    <th
                      className="border border-gray-300 px-4 py-2"
                      style={{ width: "30%" }}
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedNumberRange.map((option) => (
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        {option.Name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {option.Description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="w-full mt-5">
            <h4
              className="text-lg font-semibold mb-4"
              style={{ color: "#2A4862" }}
            >
              Variables
            </h4>

            <Autocomplete
              multiple
              disableCloseOnSelect
              options={variables}
              getOptionLabel={(option) => option.VariableName}
              onChange={(event, value) => setSelectedVariable(value)}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  <ListItemText primary={option.VariableName} />
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Variables" />
              )}
              value={selectedVariable}
              PopperComponent={(popperProps) => (
                <Popper
                  {...popperProps}
                  placement="bottom-start"
                  className="mt-4"
                />
              )}
            />
            {selectedVariable.length > 0 && (
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#2A4862" }}
                >
                  Selected Variable Details:
                </h3>
                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Integration Flow
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVariable.map((option) => (
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          {option.VariableName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {option.IntegrationFlow}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="w-full mt-5">
            <h4
              className="text-lg font-semibold mb-4"
              style={{ color: "#2A4862" }}
            >
              Data Stores
            </h4>

            <Autocomplete
              multiple
              disableCloseOnSelect
              options={dataStores}
              getOptionLabel={(option) => option.DataStoreName}
              onChange={(event, value) => setSelectedDataStore(value)}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  <ListItemText primary={option.DataStoreName} />
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select User Credentials" />
              )}
              value={selectedDataStore}
              PopperComponent={(popperProps) => (
                <Popper
                  {...popperProps}
                  placement="bottom-start"
                  className="mt-4"
                />
              )}
            />
            {selectedDataStore.length > 0 && (
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#2A4862" }}
                >
                  Selected Data Store Details:
                </h3>
                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Integration Flow
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDataStore.map((option) => (
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          {option.DataStoreName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {option.IntegrationFlow === ""
                            ? "Global"
                            : option.IntegrationFlow}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="customTagsCheckbox"
              checked={customTagsCheckbox}
              onChange={() => setCustomTagsCheckbox(!customTagsCheckbox)}
              className="mr-2"
            />
            <label htmlFor="customTagsCheckbox">Migrate Custom tags</label>
          </div>

          {(selectedNumberRange ||
            selectedVariable ||
            selectedDataStore ||
            customTagsCheckbox) && (
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          )}
        </div>
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
