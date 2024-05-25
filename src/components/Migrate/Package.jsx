import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { handlePackageList } from "../../apis/apiService";

const Package = ({ onSelect, setLoading, refreshList }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageList, setPackageList] = useState([]);
  const [error, setError] = useState(null);
  const cachedPackageList = useRef(null);

  useEffect(() => {
    const fetchPackageList = async () => {
      setLoading(true);
      try {
        const localData = localStorage.getItem("currAgent");
        if (localData) {
          const data = JSON.parse(localData);
          const apiData = data.apiData;
          
          if (apiData) {
            if(!cachedPackageList.current) {
              const packages = await handlePackageList(apiData);
              cachedPackageList.current = packages;
            }
            setPackageList(cachedPackageList.current);
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
  }, [setLoading, refreshList]);
  // {
  //   console.log(packageList);
  // }
  const handleChange = (event, value) => {
    setSelectedPackage(value);
    onSelect(value);
  };

  return (
    <div className="w-full">
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
