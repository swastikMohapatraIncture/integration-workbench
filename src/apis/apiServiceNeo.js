import axios from "axios";
import { json } from "react-router-dom";

if (!localStorage.getItem("pkgNotMigrate")) {
  localStorage.setItem("pkgNotMigrate", JSON.stringify([]));
}

function addToPkgNotMigrate(newItem) {
  // Retrieve the current array from localStorage
  let pkgNotMigrate = JSON.parse(localStorage.getItem("pkgNotMigrate"));

  // Append the new item to the array
  pkgNotMigrate.push(newItem);

  const uniqueArray = [...new Set(pkgNotMigrate)];

  // Store the updated array back in localStorage
  localStorage.setItem("pkgNotMigrate", JSON.stringify(uniqueArray));
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
        redirect: "follow",
      }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {}; // Handle empty response body

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

    let versionCanNotMigrated = 0,
      versionCanMigrated = 0,
      totalIflows = 0;

    let migratejms = 0;
    let cantmigratejms = 0;
    let totalValueMappings = 0;
    let valueMappingsCanMigrate = 0;
    let valueMappingsCannotMigrate = 0;

    for (let result of data.d.results) {
      packageIds.push(result.Id);
      if (
        (result.Vendor === "SAP" || result.PartnerContent === true) &&
        result.UpdateAvailable === true
      ) {
        totalPackages++;
        if (result.Name != "") {
          prePkgNotMigrated++;
          // If the Pre Package is not on latest Version, adding to pkgNotMigrate Local Storage
          console.log(
            `!! Integration Package ${result.Id} can not be migrated because it is not on the latest version !!`
          );
          addToPkgNotMigrate(result.Id);
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
      // Check integration flows version
      console.log("Checking Iflow's version of PACKAGE : ", id);
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
      console.log(`Iflow Version response of ${id} -- `, versionRes);
      let packageIflows = versionRes.d.results.length;
      let packageIflowsNotMigrate = 0;
      let packageIflowsMigrate = 0;

      for (let result of versionRes.d.results) {
        if (result.Version === "Active" || result.Version === "Draft") {
          packageIflowsNotMigrate++;
          addToPkgNotMigrate(result.PackageId);
        }
      }

      console.log(
        `Iflow can not be migrated in ${id}: `,
        packageIflowsNotMigrate
      );

      packageIflowsMigrate = packageIflows - packageIflowsNotMigrate;
      console.log(`Iflow can be migrated in ${id}: `, packageIflowsMigrate);

      versionCanMigrated += packageIflowsMigrate;
      versionCanNotMigrated += packageIflowsNotMigrate;
      totalIflows += packageIflows;

      // Value mappings version check

      const checkValueMappingsVersionReq = await fetch(
        `http://localhost:8082/api/v1/migration/Readiness/Check/ValueMappingsVersion?PackageId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!checkValueMappingsVersionReq.ok) {
        throw new Error(`Error: ${checkValueMappingsVersionReq.statusText}`);
      }

      const valueMappingsRes = await checkValueMappingsVersionReq.json();
      console.log(`vm response of Package: ${id}: `, valueMappingsRes);

      // ----- Only for debugging, remove later
      if (valueMappingsRes.d.results.length > 0) {
        console.log(` ------------- Found Value Mapping in PACKAGE: ${id}`);
      }
      // -----

      totalValueMappings += valueMappingsRes.d.results.length;

      const draftArtifactNames = valueMappingsRes.d.results
        .filter(
          (result) => result.Version === "Active" || result.Version === "Draft"
        )
        .map((result) => result.Name);
      console.log("dan:", draftArtifactNames);

      // Updated Logic for value mapping
      if (draftArtifactNames.length > 0) {
        console.log(
          `Following ValueMappings ${draftArtifactNames} of Package ${id} are in draft state. Refer Pre-requisite to adopt before proceeding with Migration`
        );
        valueMappingsCannotMigrate = draftArtifactNames.length;
      } else {
        valueMappingsCanMigrate =
          totalValueMappings - valueMappingsCannotMigrate;
      }

      // Post-script logic
      console.log("Total Value Mappings:", totalValueMappings);
      console.log("Value Mappings Can Be Migrated:", valueMappingsCanMigrate);
      console.log(
        "Value Mappings Cannot Be Migrated:",
        valueMappingsCannotMigrate
      );
    }

    // New fetch call for Target JMS Resources
    console.log(
      "********************  Entering Request 'Check Source JMS Resources'  ********************"
    );
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

    if (sourceJmsData.error) {
      console.log(`Error - ${sourceJmsData.error.message.value}`);
      // throw new Error(`${sourceJmsData.error.message.value}`);
    } else {
      const srcQueueCount = sourceJmsData.d.QueueNumber || 0;
      console.log("Source JMS Queue Count:", srcQueueCount);

      console.log(
        "********************  Entering Request 'Check Target JMS Resources'  ********************"
      );
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
        cantmigratejms = srcQueueCount - tgtMaxQueueCount;
        console.log(
          `Total JMS Queue on target tenant is: ${tgtMaxQueueCount} as compared to source tenant: ${srcQueueCount}. Refer documentation to bring number of JMS Queue on Target equal to what is there on source tenant`
        );
        throw new Error(
          `Not enough JMS queues available on target tenant. Used queues on source: ${srcQueueCount}, available on target: ${tgtMaxQueueCount}. Check https://blogs.sap.com/2018/12/12/cloud-integration-activating-and-managing-enterprise-messaging-capabilities-as2-jms-and-xi-adapters/.`
        );
      } else {
        migratejms = srcQueueCount;
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
      totalIflows,
      versionCanMigrated,
      versionCanNotMigrated,
      migratejms,
      cantmigratejms,
      totalValueMappings,
      valueMappingsCanMigrate,
      valueMappingsCannotMigrate,
    };
  } catch (error) {
    console.error("Error fetching readiness check data:", error);

    throw error;
  }
};

export const GetPackages = async () => {
  const pkgNotMigrated = JSON.parse(localStorage.getItem("pkgNotMigrate"));
  const currNeoAgent = JSON.parse(localStorage.getItem("currNeoAgent")) || {};

  const prepackages = [],
    custompackages = [];

  try {
    const fetchToken = await fetch(
      "http://localhost:8082/api/v1/migration/get/source/access/token",
      {
        method: "POST",
        body: JSON.stringify({ formData: currNeoAgent.NeoData }),
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(fetchToken);
    if (fetchToken && fetchToken.ok === true) {
      const fetchPackagesRaw = await fetch(
        "http://localhost:8082/api/v1/migration/Get/Custom/Packages",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("fetchPackagesRaw :", fetchPackagesRaw);

      if (!fetchPackagesRaw.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const fetchPackages = await fetchPackagesRaw.json();
      console.log(fetchPackages);

      for (let result of fetchPackages.d.results) {
        if (
          (result.Vendor === "SAP" || result.PartnerContent === true) &&
          result.UpdateAvailable === true
        ) {
          if (!pkgNotMigrated.includes(result.Id)) {
            prepackages.push(result);
          }
        } else if (result.Vendor != "SAP" && result.PartnerContent != true) {
          if (!pkgNotMigrated.includes(result.Id)) {
            custompackages.push(result);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching GetPackages:", error);

    throw error;
  }
  console.log("Pre - ", prepackages);
  console.log("Cust - ", custompackages);

  return { prepackages, custompackages };
};

export const PostPackages = async (
  selectedPrePackages,
  selectedCustomPackages
) => {
  let successful = false;
  console.log(
    "********************  Entering PostPackages  ********************"
  );
  const currNeoAgent = JSON.parse(localStorage.getItem("currNeoAgent")) || {};
  console.log("Selected Pre Packages : ", selectedPrePackages);
  console.log("Selected Custom Packages : ", selectedCustomPackages);
  try {
    const fetchToken = await fetch(
      "http://localhost:8082/api/v1/migration/get/target/access/token",
      {
        method: "POST",
        body: JSON.stringify({ oauth: currNeoAgent.CFdata }),
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(fetchToken);
    if (fetchToken && fetchToken.ok === true) {
      if (selectedPrePackages.length !== 0) {
        for (let pkg of selectedPrePackages) {
          // Try Catch used for handling errors for each Pre Package individually
          try {
            const postPrePackageRaw = await fetch(
              `http://localhost:8082/api/v1/migration/Upload/Custom/Package?packageTechnicalName=${pkg.value}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );

            const postPrePackage = await postPrePackageRaw.json();
            console.log(postPrePackage);

            if (postPrePackage.statusCodeValue !== 200) {
              throw new Error(
                `Failed to create Pre-Package ${pkg.value} message: ${postPrePackage.body.message}`
              );
            } else {
              console.log(`PRE PACKAGE ${pkg.value} MIGRATED SUCCESSFULLY !!`);
              // add the pkg in a variable or local store
              await GetArtifacts(pkg.value);
              successful = true;
            }
          } catch (error) {
            console.error(`Error uploading Pre package ${pkg.value}:`, error);
          }
        }
      } else {
        console.log("SELECTED PRE PACKAGE ARRAY LENGTH 0");
      }

      if (selectedCustomPackages.length !== 0) {
        for (let pkg of selectedCustomPackages) {
          // Try Catch used for handling errors for each Post Package individually
          try {
            const postCustomPackageRaw = await fetch(
              `http://localhost:8082/api/v1/migration/Upload/Custom/Package?packageTechnicalName=${pkg.value}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );

            const postCustomPackage = await postCustomPackageRaw.json();
            console.log("postCustomPackage Res - :", postCustomPackage);
            if (postCustomPackage.statusCodeValue !== 200) {
              throw new Error(
                `Failed to create Custom-Package ${pkg.value} message: ${postCustomPackage.body.message}`
              );
            } else {
              console.log(
                `CUSTOM PACKAGE ${pkg.value} MIGRATED SUCCESSFULLY !!`
              );
              await GetArtifacts(pkg.value);
              successful = true;
            }
          } catch (error) {
            console.error(
              `Error uploading Custom package ${pkg.value}:`,
              error
            );
          }
        }
      } else {
        console.log("SELECTED CUSTOM PACKAGE ARRAY LENGTH 0");
      }
    } else {
      throw new Error(`Error fetching token - ${fetchToken.statusText}`);
    }
  } catch (error) {
    console.error("Error posting PostPackages:", error);
    successful = false;
    throw error;
  } finally {
    console.log(
      "********************  Exit PostPackages  ********************"
    );
  }

  return successful;
};

export const GetArtifacts = async (pkdId) => {
  console.log(
    "********************  Entering GetArtifacts  ********************"
  );
  try {
    const getArtifactsRaw = await fetch(
      `http://localhost:8082/api/v1/migration/Get/Custom/Artifacts?packageTechnicalName=${pkdId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!getArtifactsRaw.ok) {
      throw new Error(`Error: ${getArtifactsRaw.statusText}`);
    }

    console.log("getArtifactsRaw Res - :", getArtifactsRaw);
    const getArtifacts = await getArtifactsRaw.json();
    console.log("Iflow's fetched: ", getArtifacts);

    let artifactConfigured = 0;
    let artifactNotConfigured = 0;
    for (let artifact of getArtifacts) {
      // Try Catch used for handling errors for each Artifact individually
      try {
        const uploadArtifactRaw = await fetch(
          `http://localhost:8082/api/v1/migration/Set/Custom/Configurations?artifactId=${artifact.Id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!uploadArtifactRaw.ok) {
          throw new Error(`Error: ${uploadArtifactRaw.statusText}`);
        }

        console.log("uploadArtifactRaw Res - :", uploadArtifactRaw);
        const uploadArtifact = await uploadArtifactRaw.json();
        console.log(uploadArtifact);

        artifactConfigured++;
        console.log("artifacts configured: ", artifactConfigured);
      } catch (artifactError) {
        artifactNotConfigured++;
        console.error(
          `Error uploading artifact ${artifact.Id}:`,
          artifactError
        );
      }
    }
    console.log(`Total artifacts configured: ${artifactConfigured}`);
    console.log(`Total artifacts not configured: ${artifactNotConfigured}`);
    console.log(
      "********************  Exit GetArtifacts  ********************"
    );
  } catch (error) {
    console.error("Error fetching artifacts:", error);
    throw error;
  }
};
export const fetchUserCredentials = async () => {
  try {
    const response = await fetch(
      "http://localhost:8082/api/v1/migration/Get/Source/UserCredentials",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.map((user) => ({
      User: user.User,
      Name: user.Name,
      Description: user.Description,
      CompanyId: user.CompanyId,
      Kind: user.Kind,
      Password: user.Password,
      label: user.Name,
    }));
  } catch (error) {
    console.error("Error fetching user credentials:", error);
    return [];
  }
};

export const fetchOAuthCredentials = async () => {
  try {
    const response = await fetch(
      "http://localhost:8082/api/v1/migration/Get/Source/OAuthCredentials"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch OAuth credentials");
    }
    const data = await response.json();
    return data.map((cred) => ({
      id: cred.ClientId,
      label: cred.Name,
      description: cred.Description,
      ClientSecret: cred.ClientSecret,
      TokenServiceUrl: cred.TokenServiceUrl,
      ClientAuthentication: cred.ClientAuthentication,
      Scope: cred.Scope,
      ScopeContentType: cred.ScopeContentType,
    }));
  } catch (error) {
    console.error("Error fetching OAuth credentials:", error);
    return [];
  }
};
