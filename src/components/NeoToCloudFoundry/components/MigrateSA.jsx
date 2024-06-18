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
} from "@mui/material";
import {
  fetchUserCredentials,
  fetchOAuthCredentials,
  fetchCertificates,
} from "../../../apis/apiServiceNeo"; // Import your fetch functions
import Loader from "../../Loader";

const MigrateSA = () => {
  const [userOptions, setUserOptions] = useState([]);
  const [oauthOptions, setOAuthOptions] = useState([]);
  const [selectedUserOption, setSelectedUserOption] = useState(null);
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
    console.log("SC: ", selectedCertificates);
    loadUserCredentials();
    loadOAuthCredentials();
  }, [selectedCertificates]);

  const handleSubmit = async () => {
    if (
      !selectedUserOption &&
      !selectedOauthOptions.length &&
      !selectedCertificates.length
    )
      return;

    setLoading(true);

    const userPayload = selectedUserOption
      ? {
          User: selectedUserOption.User,
          Description: selectedUserOption.Description,
          CompanyId: selectedUserOption.CompanyId,
          Kind: selectedUserOption.Kind,
          Name: selectedUserOption.Name,
          Password: selectedUserOption.Password,
        }
      : null;

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

    try {
      // Post user credentials
      if (userPayload) {
        const userResponse = await fetch(
          "http://localhost:8082/api/v1/migration/Upload/UserCredentials",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userPayload),
          }
        );

        if (userResponse.ok) {
          setNotification({
            open: true,
            message: "User credentials uploaded successfully",
            severity: "success",
          });
        } else {
          setNotification({
            open: true,
            message: "User credentials with the same name already exist",
            severity: "error",
          });
        }
      }

      // Post OAuth credentials
      for (const oauthPayload of oauthPayloads) {
        const oauthResponse = await fetch(
          "http://localhost:8082/api/v1/migration/Upload/OAuthCredentials",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(oauthPayload),
          }
        );

        if (oauthResponse.ok) {
          setNotification({
            open: true,
            message: "OAuth credentials uploaded successfully",
            severity: "success",
          });
        } else {
          setNotification({
            open: true,
            message: "OAuth Cedentials with same name already exists",
            severity: "error",
          });
        }
      }

      if (selectedCertificates) {
        const certificateHexalias = selectedCertificates[0].id;

        const certResponse = await fetch(
          `http://localhost:8082/api/v1/migration/Upload/customPublicCertificates?certificateHexalias=${certificateHexalias}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(certResponse);
        if (certResponse.ok) {
          setNotification({
            open: true,
            message: "Certificate uploaded successfully",
            severity: "success",
          });
        } else {
          setNotification({
            open: true,
            message: "Certificate with the same name already exists",
            severity: "error",
          });
        }
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Error uploading credentials",
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
    selectedUserOption !== null ||
    selectedOauthOptions.length ||
    selectedCertificates.length > 0;

  const handleOpenModal = async () => {
    setLoading(true);
    setModalOpen(true);
    try {
      const response = await fetch(
        "http://localhost:8082/api/v1/migration/Get/Target/OAuthCredentials"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch uploaded credentials");
      }
      const data = await response.json();
      console.log(data);
      setUploadedCredentials(data);

      //  Fetch User Credentials

      const userResponse = await fetch(
        "http://localhost:8082/api/v1/migration/Get/Target/UserCredentials"
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
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="m-4 space-y-8 mb-5">
        <h4 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
          User Credentials
        </h4>

        <Autocomplete
          options={userOptions}
          getOptionLabel={(option) => option.label}
          onChange={(event, value) => setSelectedUserOption(value)}
          renderInput={(params) => (
            <TextField {...params} label="User Client Credentials" />
          )}
          PopperProps={{
            className: "mt-4", // Adjust this value as needed
          }}
        />
        {selectedUserOption && (
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
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    {selectedUserOption.User}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {selectedUserOption.Name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {selectedUserOption.Description}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="m-4 space-y-8">
        <h4 className="text-lg font-semibold mb-4" style={{ color: "#2A4862" }}>
          Oauth2 Client Credentials
        </h4>
        <Autocomplete
          multiple
          options={oauthOptions}
          getOptionLabel={(option) => option.label}
          onChange={(event, value) => setSelectedOauthOptions(value)}
          renderInput={(params) => (
            <TextField {...params} label="Ouath Client Credentials" />
          )}
          PopperProps={{
            className: "mt-4", // Adjust this value as needed
          }}
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
                {selectedOauthOptions.map((option) => (
                  <tr key={option.id}>
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
            options={certificateOptions}
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => setSelectedCertificates(value)}
            renderInput={(params) => (
              <TextField {...params} label="Custom Certificates" />
            )}
            PopperProps={{
              className: "mt-4", // Adjust this value as needed
            }}
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
