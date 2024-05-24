import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const postApi = async (apiURL, toPostData) => {
  try {
    const res = await axios.post(apiURL, toPostData);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const postESRConnection = async (
  formData,
  setDisableNext,
  setTestingConn,
  setConnectionMessage
) => {
 await postApi(
    "http://localhost:8080/api/v1/migration/configuration/connect/esr",
    formData
  ).then((data)=>{
    if(data && data.status === "Success"){
       postApi(
        "http://localhost:8080/api/v1/migration/configuration/connect/id",
        formData
      ).then((data2)=>{
        if(data2 && data2.status==="Success"){
          const prevData = JSON.parse(localStorage.getItem("currAgent")) || {};
          const newData = { ...(prevData ? prevData : null), poData: formData };
          localStorage.setItem("currAgent", JSON.stringify(newData));
          setConnectionMessage({
            text: "Connection successful",
            type: "success",
          });
          setDisableNext(false);
        } else {
          setConnectionMessage({
            text: data?.message || "Connection unsuccessful",
            type: "error",
          });
          setDisableNext(true);
        }
        // notification(data.status);
      }).catch((error)=>{
        console.error("API call failed:", error);
      // setConnectionStatus(false);
      setConnectionMessage({ text: "Connection unsuccessful", type: "error" });
      setDisableNext(true);
      }).finally(()=>{
        setTestingConn(false);
      })
    }
  })
};

export const postCPIData = async (
  formData,
  setDisableNext,
  setTestingConn,
  setConnectionMessage
) => {
  await postApi(
    "http://localhost:8080/api/v1/migration/configuration/connect/is/cpi",
    formData
  ).then((data) => {
    try {
      if (data && data.status === "Success") {
        const prevData = JSON.parse(localStorage.getItem("currAgent")) || {};
        const newData = { ...(prevData ? prevData : null), cpiData: formData };
        // const newData = { ...(prevData ? prevData : null), formData };
        localStorage.setItem("currAgent", JSON.stringify(newData));
        // setConnectionStatus(true);
        setConnectionMessage({
          text: "Connection successful",
          type: "success",
        });
        setDisableNext(false);
      } else {
        setDisableNext(true);
        // setConnectionStatus(false);
        setConnectionMessage({
          text: data?.message || "Connection unsuccessful",
          type: "error",
        });
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

export const postAPIData = async (
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
        const prevData = JSON.parse(localStorage.getItem("currAgent")) || {};
        const newData = {
          ...(prevData ? prevData : null),
          apiData: formData,
          // adapter: [],
        };
        // const newData = { ...(prevData ? prevData : null), formData, adapter: [] };
        localStorage.setItem("currAgent", JSON.stringify(newData));
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

// Funciton to fetch the list of ICos
export const handleIcoList = async (poData) => {
  try {
    const toPostData = poData;
    const response = await axios.post(
      "http://localhost:8080/api/v1/metadata/get/ico/list",
      toPostData
    );
    // console.log(response);
    if (response.data.status === "Success") {
      return response?.data?.payload?.root?.key;
    } else {
      throw new Error("Failed to fetch ICO list");
    }
  } catch (error) {
    console.error("Error fetching ICO list:", error);
    throw error; // Re-throw the error to propagate it
  }
};

// Function to fetch the List of Packages
export const handlePackageList = (cpiData) => {
  const toPostData = cpiData;
   return axios.post("http://localhost:8080/api/v1/migration/designtime/get/package/list", toPostData)
    .then(response => {
      if (response?.data?.status === "Success") {
        return response?.data?.payload?.list;
      } else {
        throw new Error("Failed to Fetch Packages");
      }
    })
    .catch(error => {
      console.log("Error getting packages", error);
      throw error;
    });
}

// Function to create Package
export const handleCreatePackage = async (data) => {
  try {
    const toPostData = data;
    const response = await axios.post(
      "http://localhost:8080/api/v1/migration/designtime/create/package",
      toPostData
    );
    if (response?.data?.status === "Success") {
      return response?.data;
    } else {
      throw new Error("Failed to create package");
    }
  } catch (error) {
    console.log("Error Creating Packages", error);
    throw error;
  }
};

export const handleIcoDetails = (data) => {
  const toPostData = data;
  return postApi("http://localhost:8080/api/v1/migration/designtime/get/iflow/details", toPostData)
    .then(response => {
      const {iflowName, description} = response.payload;
      return {iflowName, description}
    })
};

// Function to create Exception Service
export const handleExceptionServices = async (data) => {
  try {
    const toPostData = data;
    const response = await postApi(
      "http://localhost:8080/api/v1/migration/designtime/create/exception/service",
      toPostData
    );
    if (response) {
      // console.log("response", response);
      return response;
    } else {
      throw new Error("Failed to create exception adapter");
    }
  } catch (error) {
    console.error("Error creating exception adapter:", error);
  }
};

// function for migrating the icos and value mapping
export const handleMigration = async (data, type) => {
  try {
    const toPostData = data;
    let apiUrl;

    if (type === "icos") {
      apiUrl =
        "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/iflow";
    } else {
      apiUrl =
        "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/vm";
    }

    const response = await postApi(apiUrl, toPostData);
    return response;
  } catch (error) {
    console.error("Error during migration:", error);
  }
};
