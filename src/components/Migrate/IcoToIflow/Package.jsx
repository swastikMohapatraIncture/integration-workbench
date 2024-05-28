import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { handlePackageList } from "../../../apis/apiService";

const Package = ({ onSelect, setLoading, refreshList }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageList, setPackageList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(refreshList);
    const fetchPackageList = async () => {
      setLoading(true);
      try {
        const localData = localStorage.getItem("currAgent");
        if (localData) {
          const data = JSON.parse(localData);
          const apiData = data.apiData;
          
          if (apiData) {
              const packages = await handlePackageList(apiData);
              // cachedPackageList.current = packages;
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
  }, [setLoading, refreshList]);

  const handleChange = (event, value) => {
    setSelectedPackage(value);
    onSelect(value);
  };

  return (
    <div className="w-full">
      <label className="block mb-1 text-sm">Select Package<span className="text-red-600">*</span></label>
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
