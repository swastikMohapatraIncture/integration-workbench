import axios from "axios";

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

let config = () => {
  let header = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  return header;
};

export const postApi = async (apiURL, toPostData) => {
  try {
    const res = await axios.post(apiURL, toPostData, config());
    return res.data;
  } catch (e) {
    return null;
  }
};

// const baseURL = "https://integration-workbench-testing.cfapps.eu10-004.hana.ondemand.com";
const baseURL = "/java_services/";

const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };


export const postNEOConnection = async (
  formData,
  setDisableNext,
  setTestingConn,
  setConnectionMessage
) => {
  try {
    // Get Access Token
    console.log(formData);
    const tokenResponse = await fetch(
      `${baseURL}/v1/migration/configuration/connect/source/is`,
      {
        method: "POST",
        body: JSON.stringify(formData),
        headers: headers,
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
    `${baseURL}/v1/migration/configuration/connect/target/is`,
    formData
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
      `${baseURL}/v1/metadata/readiness/check/preintegrationpackages`,
      {
        method: "GET",
        headers: headers,
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
        `${baseURL}/v1/metadata/readiness/check/integrationflowsversion?PackageId=${id}`,
        {
          method: "GET",
          headers: headers,
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
        `${baseURL}/v1/metadata/readiness/check/valuemappingsversion?PackageId=${id}`,
        {
          method: "GET",
          headers: headers,
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
      `${baseURL}/v1/metadata/readiness/check/source/jmsResources`,
      {
        method: "GET",
        headers: headers,
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
        `${baseURL}/v1/metadata/readiness/check/target/jmsResources`,
        {
          method: "GET",
          headers: headers,
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
      `${baseURL}/v1/migration/configuration/connect/source/is`,
      {
        method: "POST",
        body: JSON.stringify({ formData: currNeoAgent.NeoData }),
        headers: headers,
      }
    );

    console.log(fetchToken);
    const tokenParsed = await fetchToken.text();
    console.log(tokenParsed);
    if (fetchToken && fetchToken.ok === true) {
      const fetchPackagesRaw = await fetch(
        `${baseURL}/v1/migration/designtime/get/custom/packages`,
        {
          method: "GET",
          headers: headers,
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
  selectedCustomPackages,
  setNotification
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
      `${baseURL}/v1/migration/configuration/connect/target/is`,
      {
        method: "POST",
        body: JSON.stringify({ oauth: currNeoAgent.CFdata }),
        headers: headers,
      }
    );

    console.log(fetchToken);

    if (fetchToken && fetchToken.ok === true) {
      if (selectedPrePackages.length !== 0) {
        for (let pkg of selectedPrePackages) {
          // Try Catch used for handling errors for each Pre Package individually
          try {
            const postPrePackageRaw = await fetch(
              `${baseURL}/v1/migration/designtime/upload/custom/packages?packageTechnicalName=${pkg.value}`,
              {
                method: "POST",
                headers: headers,
              }
            );

            const postPrePackage = await postPrePackageRaw.json();
            console.log(postPrePackage);

            if (postPrePackage.statusCodeValue !== 200) {
              setNotification({
                open: true,
                message: postPrePackage.body.message,
                severity: "error",
              });
              throw new Error(
                `Failed to create Pre-Package ${pkg.value} message: ${postPrePackage.body.message}`
              );
            } else {
              console.log(`PRE PACKAGE ${pkg.value} MIGRATED SUCCESSFULLY !!`);
              await GetArtifacts(pkg.value);
              await configureValueMappings(pkg.value);
              setNotification({
                open: true,
                message: "Migration completed successfully!",
                severity: "success",
              });
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
              `${baseURL}/v1/migration/designtime/upload/custom/packages?packageTechnicalName=${pkg.value}`,
              {
                method: "POST",
                headers: headers,
              }
            );

            const postCustomPackage = await postCustomPackageRaw.json();
            console.log("postCustomPackage Res - :", postCustomPackage);
            if (postCustomPackage.statusCodeValue !== 200) {
              setNotification({
                open: true,
                message: postCustomPackage.body.message,
                severity: "error",
              });
              throw new Error(
                `Failed to create Custom-Package ${pkg.value} message: ${postCustomPackage.body.message}`
              );
            } else {
              console.log(
                `CUSTOM PACKAGE ${pkg.value} MIGRATED SUCCESSFULLY !!`
              );
              await GetArtifacts(pkg.value);
              await configureValueMappings(pkg.value);
              setNotification({
                open: true,
                message: "Migration completed successfully!",
                severity: "success",
              });
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

export const GetArtifacts = async (pkgId) => {
  console.log(
    "********************  Entering GetArtifacts  ********************"
  );
  try {
    const getArtifactsRaw = await fetch(
      `${baseURL}/v1/migration/designtime/get/custom/artifacts?packageTechnicalName=${pkgId}`,
      {
        method: "GET",
        headers: headers,
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
          `${baseURL}/v1/migration/designtime/set/custom/Configurations?artifactId=${artifact.Id}`,
          {
            method: "POST",
            headers: headers,
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
      `${baseURL}/v1/migration/designtime/get/source/usercredentials`,
      {
        method: "GET",
        headers: headers,
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
      `${baseURL}/v1/migration/designtime/get/source/oauthcredentials`,
      {
        method: "GET",
        headers: headers,
      }
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

export const configureValueMappings = async (pkgId) => {
  const pkgNotMigrated = JSON.parse(localStorage.getItem("pkgNotMigrate"));

  try {
    const getValueMapping = await fetch(
      `${baseURL}/v1/migration/designtime/get/valuemappings`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!getValueMapping.ok) {
      throw new Error(`Error fetching: ${getValueMapping.statusText}`);
    }

    console.log("getValueMapping Res - :", getValueMapping);
    const valueMappings = await getValueMapping.json();
    console.log("Value Mapping's fetched: ", valueMappings);

    for (let valueMapping of valueMappings.d.results) {
      if (valueMapping.PackageId === pkgId) {
        if (!pkgNotMigrated.includes(valueMapping.PackageId)) {
          try {
            const configureValueMapping = await fetch(
              `${baseURL}/v1/migration/designtime/upload/valuemappings?artifactId=${valueMapping.Id}`,
              {
                method: "POST",
                headers: headers,
              }
            );

            if (configureValueMapping.status !== 200) {
              const configureValueMappingResponse = await configureValueMapping.json();
              throw new Error(`${configureValueMappingResponse.message}`);
            }
            console.log(
              `Value Mapping ${valueMapping.Id} configured :`,
              configureValueMapping
            );
          } catch (error) {
            console.error(
              `Error configuring Value Mapping - ${valueMapping.Id}:`,
              error
            );
          }
        }
      } else {
        console.log(
          `Value Mapping ${valueMapping.Id} is of PACKAGE - ${valueMapping.PackageId}`
        );
        console.log(`Current Package in Loop - ${pkgId}`);
      }
    }
  } catch (error) {
    console.error("Error configuring ValueMappings:", error);
  }
};

export const fetchCertificates = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/v1/migration/designtime/get/custompubliccertificates`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const certificates = response.data.map((cert) => ({
      id: cert.Hexalias,
      label: cert.Alias,
    }));
    return certificates;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
};

export const fetchNumberRanges = async (setNumberRanges) => {
  try {
    const response = await fetch(
      `${baseURL}/v1/migration/designtime/get/numberranges`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const data = await response.json();
    setNumberRanges(data.d.results);
  } catch (error) {
    console.error("Error fetching number ranges:", error);
  }
};

export const postNumberRanges = async (
  selectedNumberRanges,
  setNotification
) => {
  for (let selectedNumberRange of selectedNumberRanges) {
    try {
      const response = await fetch(
        `${baseURL}/v1/migration/designtime/upload/numberranges?NumberRangeName=${selectedNumberRange.Name}`,
        {
          method: "POST",
          headers: headers,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotification({
          open: true,
          message: `Number range ${selectedNumberRange.Name} uploaded successfully`,
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
    }
  }
};

export const fetchVariables = async (setVariables) => {
  try {
    const response = await fetch(
      `${baseURL}/v1/migration/designtime/get/variables`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const data = await response.json();
    setVariables(data.d.results);
  } catch (error) {
    console.error("Error fetching variables:", error);
  }
};

export const postVariables = async (selectedVariables, setNotification) => {
  const currNeoAgent = JSON.parse(localStorage.getItem("currNeoAgent")) || {};

  const fetchSourceToken = await fetch(
    `${baseURL}/v1/migration/configuration/connect/source/is`,
    {
      method: "POST",
      body: JSON.stringify({ formData: currNeoAgent.NeoData }),
      headers: headers,
    }
  );

  console.log(fetchSourceToken);
  const sourceToken = await fetchSourceToken.text();
  console.log(sourceToken);

  try {
    if (fetchSourceToken && fetchSourceToken.ok === true) {
      for (let selectedVariable of selectedVariables) {
        try {
          const uploadVariable = await fetch(
            `${baseURL}/v1/migration/designtime/upload/variables?VariableName=${selectedVariable.VariableName}`,
            {
              method: "POST",
              headers: headers,
            }
          );
          console.log(uploadVariable);

          const uploadedVariable = await uploadVariable.json();

          // Checking if the name of DataStore is in CF Tenant
          const getvariablesCf = await fetch(
            `${baseURL}/v1/migration/designtime/get/target/variables`,
            {
              method: "GET",
              headers: headers,
            }
          );

          const variablesCf = await getvariablesCf.json();
          const variablesInCf = variablesCf.d.results.map(
            (result) => result.VariableName
          );
          console.log(`All the Variables in CF`, variablesInCf);

          if (
            variablesInCf.includes(selectedVariable.VariableName) &&
            uploadVariable.ok
          ) {
            setNotification({
              open: true,
              message: `Variable ${selectedVariable.VariableName} uploaded successfully`,
              severity: "success",
            });
          } else {
            setNotification({
              open: true,
              message: uploadedVariable.message,
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
        }
      }
    } else {
      throw new Error("Source Token fetching not successful");
    }
  } catch (error) {
    console.error("Error fetching source token:", error);
    setNotification({
      open: true,
      message: `Error Fetching soruce token`,
      severity: "error",
    });
  }
};

export const fetchDataStores = async (setDataStores) => {
  try {
    const response = await fetch(
      `${baseURL}/v1/migration/designtime/get/datastores`,
      {
        method: "GET",
        headers: headers,
      }
    );

    const data = await response.json();
    setDataStores(data.d.results);
  } catch (error) {
    console.error("Error fetching data stores:", error);
  }
};

export const postDataStore = async (selectedDataStores, setNotification) => {
  const currNeoAgent = JSON.parse(localStorage.getItem("currNeoAgent")) || {};

  const fetchSourceToken = await fetch(
    `${baseURL}/v1/migration/configuration/connect/source/is`,
    {
      method: "POST",
      body: JSON.stringify({ formData: currNeoAgent.NeoData }),
      headers: headers,
    }
  );

  console.log(fetchSourceToken);
  const sourceToken = await fetchSourceToken.text();
  console.log(sourceToken);

  try {
    if (fetchSourceToken && fetchSourceToken.ok === true) {
      for (let selectedDataStore of selectedDataStores) {
        try {
          const getDataStoreIds = await fetch(
            `${baseURL}/v1/migration/designtime/get/datastoresid?DataStoreName=${selectedDataStore.DataStoreName}&IntegrationFlow=${selectedDataStore.IntegrationFlow}`,
            {
              method: "GET",
              headers: headers,
            }
          );
          const dataStoresIds = await getDataStoreIds.json();
          console.log(
            `Data Store ${selectedDataStore.DataStoreName} Id: `,
            dataStoresIds
          );
          const dataStoreId = dataStoresIds.d.results[0].Id;

          const uploadDataStore = await fetch(
            `${baseURL}/v1/migration/designtime/upload/datastores?DataStoreName=${selectedDataStore.DataStoreName}&IntegrationFlow=${selectedDataStore.IntegrationFlow}&DataStoreId=${dataStoreId}`,
            {
              method: "POST",
              headers: headers,
            }
          );

          console.log("Uploading res raw - ", uploadDataStore);
          const uploadedDataStore = await uploadDataStore.json();
          console.log("Data Store Uploaded: ", uploadedDataStore);

          // Checking if the name of DataStore is in CF Tenant
          const getDataStoresCf = await fetch(
            `${baseURL}/v1/migration/designtime/get/target/datastores`,
            {
              method: "GET",
              headers: headers,
            }
          );

          const dataStoresCf = await getDataStoresCf.json();
          const dataStoreInCf = dataStoresCf.d.results.map(
            (result) => result.DataStoreName
          );
          console.log(`All the DataStores in CF`, dataStoreInCf);

          if (
            dataStoreInCf.includes(selectedDataStore.DataStoreName) &&
            uploadDataStore.ok
          ) {
            setNotification({
              open: true,
              message: "Data store uploaded successfully",
              severity: "success",
            });
          } else {
            setNotification({
              open: true,
              message: uploadedDataStore.message,
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
        }
      }
    } else {
      throw new Error("Source Token fetching not successful");
    }
  } catch (error) {
    console.error("Error fetching source token:", error);
    setNotification({
      open: true,
      message: `An error occurred while uploading DataStore`,
      severity: "error",
    });
  }
};

export const postCustomTags = async (setNotification) => {
  try {
    const postCustomTags = await fetch(
      `${baseURL}/v1/migration/designtime/upload/CustomTags`,
      {
        method: "POST",
        headers: headers,
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
  }
};

export const postUserCredentials = async (userPayloads, setNotification) => {
  if (userPayloads) {
    for (let userPayload of userPayloads) {
      try {
        const userResponse = await fetch(
          `${baseURL}/v1/migration/designtime/upload/credentials`,
          {
            method: "POST",
            headers: headers,
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
};

export const postOauthCredentials = async (oauthPayloads, setNotification) => {
  if (oauthPayloads) {
    for (const oauthPayload of oauthPayloads) {
      try {
        const oauthResponse = await fetch(
          `${baseURL}/v1/migration/designtime/upload/oauthcredentials`,
          {
            method: "POST",
            headers: headers,
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
  }
};

export const postCustomCertificates = async (
  selectedCertificates,
  setNotification
) => {
  if (selectedCertificates && selectedCertificates.length > 0) {
    for (let certificate of selectedCertificates) {
      try {
        const certificateHexalias = certificate.id;

        const certResponse = await fetch(
          `${baseURL}/v1/migration/designtime/upload/custompubliccertificates?certificateHexalias=${certificateHexalias}`,
          {
            method: "POST",
            headers: headers,
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
};

export const checkUploadedCredentials = async (
  setUploadedCredentials,
  setuserCredentials,
  setNotification,
  setLoading,
  setModalOpen
) => {
  try {
    const oauthResponse = await fetch(
      `${baseURL}/v1/migration/designtime/get/target/oauthcredentials`,
      {
        method: "GET",
        headers: headers,
      }
    );
    if (!oauthResponse.ok) {
      throw new Error("Failed to fetch uploaded credentials");
    }
    const oauthData = await oauthResponse.json();
    console.log(oauthData);
    setUploadedCredentials(oauthData);

    //  Fetch User Credentials

    const userResponse = await fetch(
      `${baseURL}/v1/migration/designtime/get/target/usercredentials`,
      {
        method: "GET",
        headers: headers,
      }
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
