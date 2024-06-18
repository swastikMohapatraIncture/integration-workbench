import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Button, Box, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import Loader from "../../Loader";

const MigrateOA = () => {
  const [numberRanges, setNumberRanges] = useState([]);
  const [selectedNumberRange, setSelectedNumberRange] = useState(null);

  const [variables, setVariables] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState(null);

  const [dataStores, setDataStores] = useState([]);
  const [selectedDataStore, setSelectedDataStore] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [loading, setLoading] = useState(false);

  const [customTagsCheckbox, setCustomTagsCheckbox] = useState(false);

  useEffect(() => {
    const fetchNumberRanges = async () => {
      try {
        const response = await fetch(
          "http://localhost:8082/api/v1/migration/Get/NumberRanges"
        );
        const data = await response.json();
        setNumberRanges(data.d.results);
      } catch (error) {
        console.error("Error fetching number ranges:", error);
      }
    };

    const fetchVariables = async () => {
      try {
        const response = await fetch(
          "http://localhost:8082/api/v1/migration/get/variables"
        );
        const data = await response.json();
        setVariables(data.d.results);
      } catch (error) {
        console.error("Error fetching variables:", error);
      }
    };

    const fetchDataStores = async () => {
      try {
        const response = await fetch(
          "http://localhost:8082/api/v1/migration/get/datastores"
        );

        const data = await response.json();
        setDataStores(data.d.results);
      } catch (error) {
        console.error("Error fetching data stores:", error);
      }
    };

    fetchNumberRanges();
    fetchVariables();
    fetchDataStores();
  }, []);

  const handleSubmit = async () => {
    if (selectedNumberRange) {
      // Handle number range submission
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8082/api/v1/migration/Upload/NumberRanges?NumberRangeName=${selectedNumberRange.Name}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setNotification({
            open: true,
            message: "Number range uploaded successfully",
            severity: "success",
          });
        } else {
          setNotification({
            open: true,
            message: data.message,
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error uploading number range:", error);
        setNotification({
          open: true,
          message: "An error occurred while uploading the number range",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    if (selectedVariable) {
      // Handle variable submission
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8082/api/v1/migration/upload/variables?VariableName=${selectedVariable.VariableName}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setNotification({
            open: true,
            message: "Variable uploaded successfully",
            severity: "success",
          });
        } else {
          setNotification({
            open: true,
            message: "Variable already exists",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error uploading variable:", error);
        setNotification({
          open: true,
          message: "An error occurred while uploading the variable",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    if (selectedDataStore) {
      // Handle data store submission
      try {
        setLoading(true);
        const getDataStoreIds = await fetch(
          `http://localhost:8082/api/v1/migration/get/datastoresid?DataStoreName=${selectedDataStore.DataStoreName}&IntegrationFlow=${selectedDataStore.IntegrationFlow}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const dataStoresIds = await getDataStoreIds.json();
        console.log(
          `Data Store ${selectedDataStore.DataStoreName} Id: `,
          dataStoresIds
        );
        const dataStoreId = dataStoresIds.d.results.Id;

        const uploadDataStore = await fetch(
          `http://localhost:8082/api/v1/migration/upload/datastores?DataStoreName=${selectedDataStore.DataStoreName}&IntegrationFlow=${selectedDataStore.IntegrationFlow}&DataStoreId=${dataStoreId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Uploading res raw - ", uploadDataStore);
        const uploadedDataStore = await uploadDataStore.json();
        console.log("Data Store Uploaded: ", uploadedDataStore);

        if (uploadDataStore.ok) {
          setNotification({
            open: true,
            message: "Data store uploaded successfully",
            severity: "success",
          });
        } else {
          setNotification({
            open: true,
            message: "Data store already exists",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error uploading data store:", error);
        setNotification({
          open: true,
          message: "An error occurred while uploading the data store",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    // Handle Customtags API call
    if (customTagsCheckbox) {
      try {
        setLoading(true);
        const postCustomTags = await fetch(
          `http://localhost:8082/api/v1/migration/Upload/CustomTags`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("post custom TAGS Response - ", postCustomTags);

        const postCustomTagsResponse = await postCustomTags.json();
        console.log("postCustomTagsResponse Res - :", postCustomTagsResponse);

        if (postCustomTags.ok) {
          setNotification({
            open: true,
            message: "Custom Tags Migrated",
            severity: "success",
          });
        } else {
          setNotification({
            open: true,
            message: postCustomTagsResponse.message,
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error calling API:", error);
        setNotification({
          open: true,
          message: "An error occurred while calling the API",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
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
            options={numberRanges}
            getOptionLabel={(option) => option.Name}
            onChange={(event, value) => setSelectedNumberRange(value)}
            renderInput={(params) => (
              <TextField {...params} label="Select Number Range" />
            )}
            PopperProps={{
              className: "mt-4",
            }}
          />

          {selectedNumberRange && (
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
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Description
                    </th>
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

          <div className="w-full mt-5">
            <h4
              className="text-lg font-semibold mb-4"
              style={{ color: "#2A4862" }}
            >
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

          <div className="w-full mt-5">
            <h4
              className="text-lg font-semibold mb-4"
              style={{ color: "#2A4862" }}
            >
              Data Stores
            </h4>

            <Autocomplete
              options={dataStores}
              getOptionLabel={(option) => option.DataStoreName}
              onChange={(event, value) => setSelectedDataStore(value)}
              renderInput={(params) => (
                <TextField {...params} label="Select Data Store" />
              )}
              PopperProps={{
                className: "mt-4",
              }}
            />

            {selectedDataStore && (
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        {selectedDataStore.DataStoreName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {selectedDataStore.IntegrationFlow === ""
                          ? "Global"
                          : selectedDataStore.IntegrationFlow}
                      </td>
                    </tr>
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
