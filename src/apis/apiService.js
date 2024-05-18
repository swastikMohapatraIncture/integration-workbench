import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const postApi = async(apiURL, toPostData) => {
  try {
    const res = await axios.post(apiURL, toPostData);
    return res;
  } catch(e) {
    return e;
  }
}

export const postESRConnection = async (formData, setDisableNext, setTestingConn) => {
  try {
    const response = await postApi("http://localhost:8080/api/v1/migration/configuration/connect/esr", formData);
    if (response.data.status === 'Success') {
      await postApi("http://localhost:8080/api/v1/migration/configuration/connect/id", formData);
      const prevData = JSON.parse(localStorage.getItem("currAgent")) || {};
      const newData = { ...(prevData ? prevData : null), poData: formData };
      localStorage.setItem("currAgent", JSON.stringify(newData));
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
    notification(response.data.status);
  } catch (error) {
    handleConnectionError(error, setTestingConn);
  } finally {
    setTestingConn(false);
  }
};

export const postCPIData = async (formData, setDisableNext, setTestingConn) => {
  try {
    const response = await postApi("http://localhost:8080/api/v1/migration/configuration/connect/is/cpi", formData);
    if (response.data.status === 'Success') {
      const prevData = JSON.parse(localStorage.getItem('currAgent')) || {};
      const newData = { ...(prevData ? prevData : null), cpiData: formData };
      localStorage.setItem("currAgent", JSON.stringify(newData));
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
    notification(response.data.status);
  } catch (error) {
    handleConnectionError(error, setTestingConn);
  } finally {
    setTestingConn(false);
  }
};

export const postAPIData = async (formData, setDisableNext, setTestingConn) => {
  try {
    const response = await postApi("http://localhost:8080/api/v1/migration/configuration/connect/is/api", formData);
    if (response.data.status === 'Success') {
      const prevData = JSON.parse(localStorage.getItem("currAgent")) || {};
      const newData = { ...(prevData ? prevData : null), apiData: formData, adapter: [] };
      localStorage.setItem('currAgent', JSON.stringify(newData));
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
    notification(response.data.status);
  } catch (error) {
    handleConnectionError(error, setTestingConn);
  } finally {
    setTestingConn(false);
  }
};

const notification = (type) => {
  const message = type === 'Success' ? "Connection Successful" : "Connection Failed";
  const toastType = type === 'Success' ? toast.success : toast.error;
  toastType(message, { position: toast.POSITION.BOTTOM_CENTER });
};

const handleConnectionError = (error, setTestingConn) => {
  console.error("Error testing connection:", error.message);
  toast.error("Connection Failed - " + error.message, { position: toast.POSITION.BOTTOM_CENTER });
  setTestingConn(false);
};


// Funciton to fetch the list of ICos
export const handleIcoList = async (poData) => {
  try {
    const toPostData = poData;
    const response = await axios.post("http://localhost:8080/api/v1/metadata/get/ico/list", toPostData);
    // console.log(response);
    if (response.data.status === 'Success') {
      return response?.data?.payload?.root?.key;
    } else {
      throw new Error('Failed to fetch ICO list');
    }
  } catch (error) {
    console.error('Error fetching ICO list:', error);
    throw error; // Re-throw the error to propagate it
  }
}

// Function to fetch the List of Packages
export const handlePackageList = async(cpiData) => {
  try {
    const toPostData = cpiData;
    const response = await axios.post("http://localhost:8080/api/v1/migration/designtime/get/package/list", toPostData);
    if(response?.data?.status === "Success") {
      return response?.data?.payload?.list;
    } else {
      throw new Error("Failed to Fetch Packages");
    }
  } catch(error) {
    console.log("Error getting packages", error);
    throw error;
  }
}

// Function to create Package
export const handleCreatePackage = async(data) => {
  try {
    const toPostData = data;
    const response = await axios.post('http://localhost:8080/api/v1/migration/designtime/create/package', toPostData);
    if(response?.data?.status === "Success") {
      return response?.data;
    } else {
      throw new Error("Failed to create package");
    }
  } catch(error) {
    console.log("Error Creating Packages", error);
    throw error;
  }
}


// Function to fetch ICO Names and Description
export const handleIcoDetails = async (data) => {
  try {
    const toPostData = data.conventionData;
    const response = await postApi("http://localhost:8080/api/v1/migration/designtime/get/iflow/details", toPostData);

    if (response && response.data) {
      const names = response.data.map(item => item?.iflowName);
      const description = response.data.map(item => item?.description);
      return { names, description };
    } else {
      throw new Error("Empty response received");
    }
  } catch (error) {
    console.error("Error fetching ICO details:", error);
    toast.error("Failed to fetch ICO details", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    return { names: [], description: [] }; 
  }
}


// Function to create Exception Service 
export const handleExceptionServices = async (data, value) => {
  try {
    const toPostData = data;
    const response = await postApi("http://localhost:8080/api/v1/migration/designtime/create/exception/adapter", toPostData);

    if (response.data.status === "Success") {
      const currAgent = JSON.parse(localStorage.getItem("currAgent"));
      const updatedCurrentAgent = { ...currAgent, adapter: value };
      localStorage.setItem("currAgent", JSON.stringify(updatedCurrentAgent));
    } else {
      throw new Error("Failed to create exception adapter");
    }
  } catch (error) {
    console.error("Error creating exception adapter:", error);
  }
}

// function for migrating the icos and value mapping
export const handleMigration = async (data, type) => {
  try {
    const toPostData = data;
    let apiUrl;

    if (type === 'icos') {
      apiUrl = "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/iflow";
    } else {
      apiUrl = "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/vm";
    }

    const response = await postApi(apiUrl, toPostData);
    console.log(response);
  } catch (error) {
    console.error("Error during migration:", error);
  }
}
