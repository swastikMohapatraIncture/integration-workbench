import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { handlePackageList } from "../../apis/apiService";

const Package = ({ onSelect, setLoading }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageList, setPackageList] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cpiData = {
    name: "inc",
    clientId: "sb-7489d894-5a54-4e09-b5bc-05d2a67da302!b285446|it!b55215",
    url: "https://196e1fd0trial.it-cpitrial06.cfapps.us10-001.hana.ondemand.com",
    clientSecret:
      "31bc3d8a-39c6-486d-ba7d-7ebcdbae828c$pSj79Jx1okSPRJlG87zXIckAsy-8Av9NGWsjZsqjajk=",
    tokenUrl:
      "https://196e1fd0trial.authentication.us10.hana.ondemand.com/oauth/token",
  };

  useEffect(() => {
    const fetchPackageList = async () => {
      setLoading(true);
      try {
        const localData = localStorage.getItem("currAgent");
        if (localData) {
          const data = JSON.parse(localData);
          const apiData = data.apiData;
          
          if (apiData) {
            const packages = await handlePackageList(apiData);
            setPackageList(packages);
          } else {
            setError(new Error("apiData is missing or invalid"));
          }
        } else {
          setError(new Error("No data found in localStorage for 'currAgent'"));
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageList();
  }, [setLoading]);
  {
    console.log(packageList);
  }
  const handleChange = (event, value) => {
    // console.log("value",value);
    setSelectedPackage(value);
    // console.log("selected ",selectedPackage);
    onSelect(value);
  };

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error loading packages : {error.message}</p>;

  return (
    <div className="w-full">
      {/* {selectedPackage.id}  */}
      <label className="block mb-1 text-sm">Select Package</label>
      <Autocomplete
        fullWidth
        value={selectedPackage}
        onChange={handleChange}
        size="small"
        options={packageList}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            // label="Package"
            variant="outlined"
            placeholder="Select Package"
          />
        )}
        sx={{
          "& .MuiInputBase-input": { height: "1.8em", padding: "6px 12px", fontSize: 14 },
        }}
      />
    </div>
  );
};

export default Package;
