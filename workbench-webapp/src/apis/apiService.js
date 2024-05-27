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

const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic c2ItbmEtYmJiNGZmZGUtNWRlYi00ZmJjLTgzZDktZTcyNWIwZGY3NjhhIXQzNzk1ODA6elNSWlIzVG1OVE85SjhuMmNVY0ZFbWVJampjPQ==");
myHeaders.append("Cookie", "__VCAP_ID__=39b099b4-f39d-4e60-5a99-0e46; JSESSIONID=EF6737ECDC9B8430354CE498583A2778; __VCAP_ID__=2d27c4d9-1cb0-4f2a-68d6-56e6");

// const requestOptions = {
//   method: "GET",
//   headers: myHeaders,
//   redirect: "follow"
// };

// fetch("https://inc-cust-poc.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));

// const apiUrl ="https://integration-workbench.cfapps.eu10-004.hana.ondemand.com"
const apiUrl = "/java_services";

export const postESRConnection = async (
  formData,
  setDisableNext,
  setTestingConn,
  setConnectionMessage
) => {
  await postApi(
    `${apiUrl}/api/v1/migration/configuration/connect/esr`,
    formData
  ).then((data) => {
    if (data && data.status === "Success") {
      postApi("${apiUrl}/api/v1/migration/configuration/connect/id", formData)
        .then((data2) => {
          if (data2 && data2.status === "Success") {
            const prevData =
              JSON.parse(localStorage.getItem("currAgent")) || {};
            const newData = {
              ...(prevData ? prevData : null),
              poData: formData,
            };
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
        })
        .catch((error) => {
          console.error("API call failed:", error);
          // setConnectionStatus(false);
          setConnectionMessage({
            text: "Connection unsuccessful",
            type: "error",
          });
          setDisableNext(true);
        })
        .finally(() => {
          setTestingConn(false);
        });
    }
  });
};

//NEO to  CF functions

export const postNEOConnection = async (
  formData,
  setDisableNext,
  setTestingConn,
  setConnectionMessage
) => {
  await postApi(
    "https://webhook.site/3d69f502-16c9-4316-bc63-e0caa1e6fd61",

    formData
  )
    .then((data) => {
      if (true) {
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
          text: data?.message || "Connection unsuccessful",
          type: "error",
        });
        setDisableNext(true);
      }
    })
    .catch((error) => {
      console.error("API call failed:", error);
      // setConnectionStatus(false);
      setConnectionMessage({ text: "Connection unsuccessful", type: "error" });
      setDisableNext(true);
    })
    .finally(() => {
      setTestingConn(false);
    });
};

export const postCFData = async (
  formData,
  setDisableNext,
  setTestingConn,
  // setConnectionStatus,
  setConnectionMessage
) => {
  await postApi(
    "${apiUrl}/api/v1/migration/configuration/connect/is/api",
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

//--------------------------------------------------------------------------------------------------
export const postCPIData = async (
  formData,
  setDisableNext,
  setTestingConn,
  setConnectionMessage
) => {
  await postApi(
    `${apiUrl}/api/v1/migration/configuration/connect/is/cpi`,
    formData
  ).then((data) => {
    try {
      if (data && data.status === "Success") {
        const prevData = JSON.parse(localStorage.getItem("currAgent")) || {};
        const newData = { ...(prevData ? prevData : null), cpiData: formData };
        localStorage.setItem("currAgent", JSON.stringify(newData));
        setConnectionMessage({
          text: "Connection successful",
          type: "success",
        });
        setDisableNext(false);
      } else {
        setDisableNext(true);
        setConnectionMessage({
          text: data?.message || "Connection unsuccessful",
          type: "error",
        });
      }
    } catch (error) {
      setConnectionMessage({ text: "Connection unsuccessful", type: "error" });
      setDisableNext(true);
    } finally {
      setTestingConn(false);
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
    `${apiUrl}/api/v1/migration/configuration/connect/is/api`,
    formData
  ).then((data) => {
    try {
      if (data && data.status === "Success") {
        const prevData = JSON.parse(localStorage.getItem("currAgent")) || {};
        const newData = {
          ...(prevData ? prevData : null),
          apiData: formData,
        };
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
    } catch (error) {
      console.error("API call failed:", error);
      setConnectionMessage({ text: "Connection unsuccessful", type: "error" });
      setDisableNext(true);
    } finally {
      setTestingConn(false);
    }
  });
};

// Funciton to fetch the list of ICos
export const handleIcoList = async (poData) => {
  try {
    const toPostData = poData;
    const response = await axios.post(
      `${apiUrl}/api/v1/metadata/get/ico/list`,
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
  return axios
    .post(`${apiUrl}/api/v1/migration/designtime/get/package/list`, toPostData)
    .then((response) => {
      if (response?.data?.status === "Success") {
        return response?.data?.payload?.list;
      } else {
        throw new Error("Failed to Fetch Packages");
      }
    })
    .catch((error) => {
      console.log("Error getting packages", error);
      throw error;
    });
};

// Function to create Package
export const handleCreatePackage = async (data) => {
  try {
    const toPostData = data;
    const response = await axios.post(
      `${apiUrl}/api/v1/migration/designtime/create/package`,
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
  return postApi(
    `${apiUrl}/api/v1/migration/designtime/get/iflow/details`,
    toPostData
  ).then((response) => {
    const { iflowName, description } = response.payload;
    return { iflowName, description };
  });
};

// Function to create Exception Service
export const handleExceptionServices = async (data) => {
  try {
    const toPostData = data;
    const response = await postApi(
      `${apiUrl}/api/v1/migration/designtime/create/exception/service`,
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
      apiUrl = `${apiUrl}/api/v1/migration/designtime/migrate/ico/to/iflow`;
    } else {
      apiUrl = `${apiUrl}/api/v1/migration/designtime/migrate/ico/to/vm`;
    }

    const response = await postApi(apiUrl, toPostData);
    return response;
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

// export const compareFiles = async (data) => {
//   await postApi("${apiUrl}/api/v1/comparison/files", data).then(
//     (data) => {
//       if (data?.status == "Success") {
//         return data?.message;
//       } else {
//         data?.message;
//       }
//     }
//   );
// };

export const postFileCompareApi = async (files) => {
  // Check if xmlFile1 and xmlFile2 properties exist and are arrays
  if (
    !files ||
    !Array.isArray(files?.xmlFile1) ||
    !Array.isArray(files?.xmlFile2)
  ) {
    console.error("Invalid files object:", files);
    return null;
  }

  const formData = new FormData();

  // Append files from xmlFile1
  files.xmlFile1.forEach((file) => {
    formData.append("xmlFile1", file);
  });

  // Append files from xmlFile2
  files.xmlFile2.forEach((file) => {
    formData.append("xmlFile2", file);
  });

  try {
    const response = await axios.post(
      "${apiUrl}/api/v1/comparison/files",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error uploading files:", error);
    return null;
  }
};

export const getIFlows = async (poData) => {
  try {
    const toPostData = poData;
    const response = await axios.post(
      `${apiUrl}/api/v1/comparison/get/artifacts/Id`,
      toPostData
    );
    // console.log(response);
    if (response.data.status === "Success") {
      return response?.data?.payload;
    } else {
      throw new Error("Failed to fetch ICO list");
    }
  } catch (error) {
    console.error("Error fetching ICO list:", error);
    throw error; // Re-throw the error to propagate it
  }
};

export const generateReport = async (data) => {
  const toPostData = data;
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/comparison/generate/report`,
      toPostData
    );

    // Check if the status code is in the range of 200-299 (success)
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      // Handle the case where the status code indicates an error
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    // Handle any other errors (network issues, etc.)
    console.error("Error generating report:", error);
    throw error;
  }
};

export const valueMappingList = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/metadata/get/vm/list`,
      data
    );

    if (response.data.status === "Success") {
      return response.data.payload;
    } else {
      throw new Error(response.data.message || "Failed to fetch data");
    }
  } catch (error) {
    return error.message;
  }
};

export const migrateValueMapping = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/migration/designtime/migrate/ico/to/vm`,
      data
    );

    // if(response.data.status === "Success")
    console.log(response);
  } catch (error) {
    return error.message;
  }
};
