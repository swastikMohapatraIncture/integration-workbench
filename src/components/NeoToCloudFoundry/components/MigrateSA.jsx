import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Alert,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  ListItemText,
  Popper,
} from "@mui/material";
import {
  fetchUserCredentials,
  fetchOAuthCredentials,
  fetchCertificates,
} from "../../../apis/apiServiceNeo"; // Import your fetch functions
import Loader from "../../Loader";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";

const baseURL = "/java_services/";

const MigrateSA = () => {
  const [userOptions, setUserOptions] = useState([]);
  const [oauthOptions, setOAuthOptions] = useState([]);
  const [selectedUserOption, setSelectedUserOption] = useState([]);
  const [selectedOauthOptions, setSelectedOauthOptions] = useState([]);
  const [userCredentials, setuserCredentials] = useState([]);
  const [certificateOptions, setCertificateOptions] = useState([]);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedCredentials, setUploadedCredentials] = useState([]);

  useEffect(() => {
    const loadUserCredentials = async () => {
      const userCredentials = await fetchUserCredentials();
      setUserOptions(userCredentials);
    };

    const loadOAuthCredentials = async () => {
      const oauthCredentials = await fetchOAuthCredentials();
      setOAuthOptions(oauthCredentials);
    };
    const getCertificates = async () => {
      const certificates = await fetchCertificates();
      setCertificateOptions(certificates);
    };

    getCertificates();
    loadUserCredentials();
    loadOAuthCredentials();
  }, []);

  const handleSubmit = async () => {
    console.log(selectedOauthOptions);
    if (
      !selectedUserOption &&
      !selectedOauthOptions.length &&
      !selectedCertificates.length
    )
      return;

    setLoading(true);
    console.log(selectedUserOption);

    const userPayloads = selectedUserOption.map((option) => ({
      User: option.User,
      Description: option.Description,
      CompanyId: option.CompanyId,
      Kind: option.Kind,
      Name: option.Name,
      Password: option.Password,
    }));

    console.log("userPayloads - ", userPayloads);

    const oauthPayloads = selectedOauthOptions.map((option) => ({
      Description: option.description,
      Scope: option.Scope,
      ClientSecret: option.ClientSecret,
      TokenServiceUrl: option.TokenServiceUrl,
      ClientId: option.id,
      ClientAuthentication: option.ClientAuthentication,
      Name: option.label,
      ScopeContentType: option.ScopeContentType,
    }));

    console.log("oauthPayloads - ", oauthPayloads);

    try {
      // Post user credentials
      if (userPayloads) {
        for (let userPayload of userPayloads) {
          try {
            const userResponse = await fetch(
              `${baseURL}/v1/migration/designtime/upload/credentials`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(userPayload),
              }
            );

            const res = await userResponse.json();

            if (userResponse.ok) {
              setNotification({
                open: true,
                message: `User credential ${userPayload.Name} uploaded successfully`,
                severity: "success",
              });
            } else {
              setNotification({
                open: true,
                message: res.message,
                severity: "error",
              });
            }
          } catch (error) {
            setNotification({
              open: true,
              message: "Error uploading user credentials",
              severity: "error",
            });
          }
        }
      }

      // Post OAuth credentials
      for (const oauthPayload of oauthPayloads) {
        try {
          const oauthResponse = await fetch(
            `${baseURL}/v1/migration/designtime/upload/oauthcredentials`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(oauthPayload),
            }
          );
          const res = await oauthResponse.json();

          if (oauthResponse.ok) {
            setNotification({
              open: true,
              message: `OAuth credentials ${oauthPayload.Name} uploaded successfully`,
              severity: "success",
            });
          } else {
            setNotification({
              open: true,
              message: res.message,
              severity: "error",
            });
          }
        } catch (error) {
          setNotification({
            open: true,
            message: "Error uploading OAuth credentials",
            severity: "error",
          });
        }
      }

      // Post certificates
      if (selectedCertificates && selectedCertificates.length > 0) {
        for (let certificate of selectedCertificates) {
          try {
            const certificateHexalias = certificate.id;

            const certResponse = await fetch(
              `${baseURL}/v1/migration/designtime/upload/custompubliccertificates?certificateHexalias=${certificateHexalias}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const res = await certResponse.json();

            if (certResponse.ok) {
              setNotification({
                open: true,
                message: `Certificate ${certificate.id} uploaded successfully`,
                severity: "success",
              });
            } else {
              setNotification({
                open: true,
                message: res.message,
                severity: "error",
              });
            }
          } catch (error) {
            setNotification({
              open: true,
              message: "Error uploading certificate",
              severity: "error",
            });
          }
        }
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Unexpected error during upload",
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
    selectedUserOption.length > 0 ||
    selectedOauthOptions.length ||
    selectedCertificates.length > 0;

  const handleOpenModal = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${baseURL}/v1/migration/designtime/get/target/oauthcredentials`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch uploaded credentials");
      }
      const data = await response.json();
      console.log(data);
      setUploadedCredentials(data);

      //  Fetch User Credentials

      const userResponse = await fetch(
        `${baseURL}/v1/migration/designtime/get/target/usercredentials`
      );
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user credentials");
      }

      const userData = await userResponse.json();
      setuserCredentials(userData);
    } catch (error) {
      setNotification({
        open: true,
        message: "Error fetching uploaded credentials",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div
        style={{ position: "relative", filter: loading ? "blur(5px)" : "none" }}
      >
        <div className="m-4 space-y-8 mb-5">
          <h4
            className="text-lg font-semibold mb-4"
            style={{ color: "#2A4862" }}
          >
            User Credentials
          </h4>

          <Autocomplete
            multiple
            disableCloseOnSelect
            options={userOptions}
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => setSelectedUserOption(value)}
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
              <TextField {...params} placeholder="Select User Credentials" />
            )}
            value={selectedUserOption}
            PopperComponent={(popperProps) => (
              <Popper
                {...popperProps}
                placement="bottom-start"
                className="mt-4"
              />
            )}
          />

          {selectedUserOption.length > 0 && (
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#2A4862" }}
              >
                Selected User Details:
              </h3>
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUserOption.map((option, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {option.User}
                      </td>
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
        </div>

        <div className="m-4 space-y-8">
          <h4
            className="text-lg font-semibold mb-4"
            style={{ color: "#2A4862" }}
          >
            Oauth2 Client Credentials
          </h4>

          <Autocomplete
            multiple
            disableCloseOnSelect
            options={oauthOptions}
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => setSelectedOauthOptions(value)}
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
              <TextField
                {...params}
                placeholder="Select Oauth2 Client Credentials"
              />
            )}
            value={selectedOauthOptions}
            PopperComponent={(popperProps) => (
              <Popper
                {...popperProps}
                placement="bottom-start"
                className="mt-4"
              />
            )}
          />

          {selectedOauthOptions.length > 0 && (
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#2A4862" }}
              >
                Selected Options Details:
              </h3>
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOauthOptions.map((option, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {option.id}
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

          <div className="">
            <h4
              className="text-lg font-semibold mb-4"
              style={{ color: "#2A4862" }}
            >
              Custom Certificates
            </h4>

            <Autocomplete
              multiple
              disableCloseOnSelect
              options={certificateOptions}
              getOptionLabel={(option) => option.label}
              onChange={(event, value) => setSelectedCertificates(value)}
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
                <TextField
                  {...params}
                  placeholder="Select Custom Certificates"
                />
              )}
              value={selectedCertificates}
              PopperComponent={(popperProps) => (
                <Popper
                  {...popperProps}
                  placement="bottom-start"
                  className="mt-4"
                />
              )}
            />

            {selectedCertificates.length > 0 && (
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#2A4862" }}
                >
                  Selected Certificates:
                </h3>
                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Content
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCertificates.map((cert, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                          {cert.id}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {cert.label}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              style={{ marginRight: "auto" }}
            >
              Check Uploaded Credentials
            </Button>
            {isButtonVisible && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginLeft: "auto" }}
              >
                Submit
              </Button>
            )}
          </div>
        </div>
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

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          p={2}
          bgcolor="rgba(0, 0, 0, 0.5)" // Dark background with transparency
        >
          <Paper
            style={{
              maxWidth: "90%", // Increase the max width
              maxHeight: "80%",
              overflow: "auto",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "8px",
            }}
          >
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "#2A4862" }}
            >
              Uploaded Credentials
            </h2>

            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#2A4862" }}
            >
              OAuth Credentials
            </h3>
            <TableContainer sx={{ padding: "22px" }}>
              <Table sx={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      S.No
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      TokenServiceUrl
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uploadedCredentials.map((credential, index) => (
                    <TableRow key={`${credential.ClientId}-${index}`}>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {credential.ClientId}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {credential.Name}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {credential.Description}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {credential.TokenServiceUrl}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#2A4862" }}
            >
              User Credentials
            </h3>
            <TableContainer sx={{ padding: "22px" }}>
              <Table sx={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      S.No
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      CompanyId
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      Kind
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        color: "#2A4862",
                        padding: "12px",
                      }}
                    >
                      Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userCredentials.map((credential, index) => (
                    <TableRow key={`${credential.User}-${index}`}>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {credential.User}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {credential.Description}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {credential.CompanyId}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {credential.Kind}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium", padding: "12px" }}>
                        {credential.Name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseModal}
              style={{ marginTop: "16px" }}
            >
              Close
            </Button>
          </Paper>
        </Box>
      </Modal>
    </>
  );
};

export default MigrateSA;
