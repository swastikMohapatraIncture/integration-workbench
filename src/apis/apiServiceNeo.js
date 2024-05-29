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

    const tokenResponse = await fetch(
      "http://localhost:8081/api/v1/migration/get/access/token",
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );

    console.log(tokenResponse);
    if (tokenResponse && tokenResponse.ok === true) {
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      console.log("Access Token:", accessToken);
      console.log(formData);

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
  await postApi(
    "http://localhost:8080/api/v1/migration/configuration/connect/is/api",
    formData
  ).then((data) => {
    try {
      if (data && data.status === "Success") {
        const prevData = JSON.parse(localStorage.getItem("currNeoAgent")) || {};
        const newData = {
          ...(prevData ? prevData : null),
          CFdata: formData,
          // adapter: [],
        };
        // const newData = { ...(prevData ? prevData : null), formData, adapter: [] };
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
