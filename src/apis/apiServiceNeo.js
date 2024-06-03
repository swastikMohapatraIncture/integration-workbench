import axios from "axios";

if (!localStorage.getItem('pkgNotMigrate')) {
  localStorage.setItem('pkgNotMigrate', JSON.stringify([]));
}

function addToPkgNotMigrate(newItem) {
  // Retrieve the current array from localStorage
  let pkgNotMigrate = JSON.parse(localStorage.getItem('pkgNotMigrate'));

    // Append the new item to the array
    pkgNotMigrate.push(newItem);
  

  // Store the updated array back in localStorage
  localStorage.setItem('pkgNotMigrate', JSON.stringify(pkgNotMigrate));
}


export const postApi = async (apiURL, toPostData) => {
  try {
    const res = await axios.post(apiURL, toPostData);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const getApi = async (apiURL, params = {}) => {
  try {
    const res = await axios.get(apiURL, { params });
    return res.data;
  } catch (e) {
    console.error("Error fetching data:", e);
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
    console.log(data);
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
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};  // Handle empty response body

    console.log("Readiness Check Data:", data);

    // Checking if pre package content exists and can be migrated or not
    console.log(
      "********************  Entering Request 'Check Pre-Package Content'  ********************"
    );
    let totalPackages = 0;
    let prePkgNotMigrated = 0;
    let customPackages = 0;
    let custPkgNotMigrated = 0;
    let packageIds = [];
    let artifactVersion = [];

    let versionCanNotMigrated = 0,
      versionCanMigrated = 0;

    for (let result of data.d.results) {
      packageIds.push(result.Id);
      if (
        (result.Vendor === "SAP" || result.PartnerContent === true) &&
        result.UpdateAvailable === true
      ) {
        totalPackages++;
        if (result.Name != "") {
          prePkgNotMigrated++;
        }
      } else if (result.Vendor != "SAP" && result.PartnerContent != true) {
        customPackages++;
        if (result.UpdateAvailable === true) {
          custPkgNotMigrated++;
        }
      }
    }
    console.log(packageIds);

    for (let id of packageIds) {
      const checkIflowVersionReq = await fetch(
        `http://localhost:8082/api/v1/migration/Readiness/Check/IntegrationFlowsVersion?PackageId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!checkIflowVersionReq.ok) {
        throw new Error(`Error: ${checkIflowVersionReq.statusText}`);
      }

      const versionRes = await checkIflowVersionReq.json();
      for (let result of versionRes.d.results) {
        artifactVersion = result.Version;
        if (artifactVersion === "Active") {
          versionCanNotMigrated++;
        }
      }
    }

    console.log("Version can not be migrated: ", versionCanNotMigrated);

    versionCanMigrated = packageIds.length - versionCanNotMigrated;
    console.log("Version can be migrated: ", versionCanMigrated);

    // New fetch call for JMS Resources
    // const jmsResourcesResponse = await fetch(
    //   "http://localhost:8082/api/v1/migration/Readiness/Check/Source/JMSResources",
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // if (!jmsResourcesResponse.ok) {
    //   throw new Error(`Error: ${jmsResourcesResponse.statusText}`);
    // }

    // const jmsResourcesData = await jmsResourcesResponse.json();
    // console.log("JMS Resources Data:", jmsResourcesData);

     // New fetch call for Source JMS Resources
     console.log("********************  Entering Request 'Check Source JMS Resources'  ********************");
     const sourceJmsResponse = await fetch(
       "http://localhost:8082/api/v1/migration/Readiness/Check/Source/JMSResources",
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       }
     );
 
     if (!sourceJmsResponse.ok) {
       throw new Error(`Error: ${sourceJmsResponse.statusText}`);
     }
 
     const sourceJmsData = await sourceJmsResponse.json();
     console.log("Source JMS Resources Data:", sourceJmsData);
 
     const srcQueueCount = sourceJmsData.d.QueueNumber || 0;
     console.log("Source JMS Queue Count:", srcQueueCount);
 
     // New fetch call for Target JMS Resources
     console.log("********************  Entering Request 'Check Target JMS Resources'  ********************");
     const targetJmsResponse = await fetch(
       "http://localhost:8082/api/v1/migration/Readiness/Check/Target/JMSResources",
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       }
     );
 
     if (!targetJmsResponse.ok) {
       throw new Error(`Error: ${targetJmsResponse.statusText}`);
     }
 
     const targetJmsData = await targetJmsResponse.json();
     console.log("Target JMS Resources Data:", targetJmsData);
 
     const tgtMaxQueueCount = targetJmsData.d.MaxQueueNumber || 0;
     console.log("Target JMS Queue Count:", tgtMaxQueueCount);
 
     if (tgtMaxQueueCount < srcQueueCount) {
       console.log(
         `Total JMS Queue on target tenant is: ${tgtMaxQueueCount} as compared to source tenant: ${srcQueueCount}. Refer documentation to bring number of JMS Queue on Target equal to what is there on source tenant`
       );
       throw new Error(
         `Not enough JMS queues available on target tenant. Used queues on source: ${srcQueueCount}, available on target: ${tgtMaxQueueCount}. Check https://blogs.sap.com/2018/12/12/cloud-integration-activating-and-managing-enterprise-messaging-capabilities-as2-jms-and-xi-adapters/.`
       );
     } else {
       console.log(
         "Maximum available JMS queue in target tenant is enough as per used queue on source Tenant."
       );
     }
 
     if (targetJmsResponse.status === 500 && srcQueueCount > 0) {
       console.log(
         "Enterprise Messaging is not activated on target tenant, however source tenant has JMS queue usage."
       );
       throw new Error(
         "Enterprise Messaging is not activated on target tenant, however source tenant has JMS queue usage. Check https://blogs.sap.com/2018/12/12/cloud-integration-activating-and-managing-enterprise-messaging-capabilities-as2-jms-and-xi-adapters/."
       );
     }
 
     console.log(
       "********************  Exiting Request 'Check JMS Resources'  ********************"
     );

    return {
      totalPackages,
      prePkgNotMigrated,
      customPackages,
      custPkgNotMigrated,
      packageIds,
      versionCanMigrated,
      versionCanNotMigrated,
    };
  } catch (error) {
    console.error("Error fetching readiness check data:", error);

    throw error;
  }
};

