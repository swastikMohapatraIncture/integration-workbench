import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export const postApi = async (apiURL, toPostData) => {
  try {
    const res = await axios.post(apiURL, toPostData);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const postNEOConnection = async (
  formData,
  setDisableNext,
  setTestingConn,
  setConnectionMessage
) => {
  try {
    // Step 1: Get Access Token
    console.log(formData);
    const tokenResponse = await fetch(
      "http://localhost:8082/api/v1/migration/get/source/access/token",
      {
        method: "POST",
        body: JSON.stringify({ formData: formData }),
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(tokenResponse);
    if (tokenResponse && tokenResponse.ok === true) {
      // const tokenData = await tokenResponse.json();
      // const accessToken = tokenData.access_token;

      // console.log("Access Token:", accessToken);
      // console.log(formData);

      const prevData = JSON.parse(localStorage.getItem("currNeoAgent")) || {};
      const newData = { ...(prevData ? prevData : null), NeoData: formData };
      localStorage.setItem("currNeoAgent", JSON.stringify(newData));
      setConnectionMessage({
        text: "Connection successful",
        type: "success",
      });
      setDisableNext(false);
    } else {
      setConnectionMessage({
        text: tokenResponse?.message || "Connection unsuccessful",
        type: "error",
      });
      setDisableNext(true);
    }
  } catch (error) {
    console.error("API call failed:", error);
    // setConnectionStatus(false);
    setConnectionMessage({ text: "Connection unsuccessful", type: "error" });
    setDisableNext(true);
  } finally {
    setTestingConn(false);
  }
};

export const postCFData = async (
  formData,
  setDisableNext,
  setTestingConn,
  // setConnectionStatus,
  setConnectionMessage
) => {
  console.log(formData);
  await postApi(
    "http://localhost:8082/api/v1/migration/get/target/access/token",
    { oauth: formData }
  ).then((data) => {
    try {
      if (data) {
        const prevData = JSON.parse(localStorage.getItem("currNeoAgent")) || {};
        const newData = {
          ...(prevData ? prevData : null),
          CFdata: formData,
        };
        localStorage.setItem("currNeoAgent", JSON.stringify(newData));
        // setConnectionStatus(true);
        setConnectionMessage({
          text: "Connection successful",
          type: "success",
        });
        setDisableNext(false);
      } else {
        // setConnectionStatus(false);
        setConnectionMessage({
          text: data?.message || "Connection unsuccessful",
          type: "error",
        });
        setDisableNext(true);
      }
    } catch (error) {
      console.error("API call failed:", error);
      // setConnectionStatus(false);
      setConnectionMessage({ text: "Connection unsuccessful", type: "error" });
      setDisableNext(true);
    } finally {
      setTestingConn(false); // Ensure this is called regardless of success or failure
    }
  });
};

export const readinessCheck = async () => {
  try {
    const response = await fetch(
      "http://localhost:8082/api/v1/migration/Readiness/Check/PreIntegrationPackages",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Readiness Check Data:", data);

    // You can process the data further here if needed
    return data;
  } catch (error) {
    console.error("Error fetching readiness check data:", error);
    // Handle the error appropriately here
    throw error; // Rethrow the error if you want to handle it at a higher level
  }
};
