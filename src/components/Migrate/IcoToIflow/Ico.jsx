import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types'
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { handleIcoList, handleIcoDetails } from "../../../apis/apiService";

const Ico = ({ onIcoDetailsReceived, setLoading }) => {
  const [icoList, setIcoList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIcos, setSelectedIcos] = useState([]);
  const [icoDetails, setIcoDetails] = useState([]);

  useEffect(() => {
    const fetchIcoList = async () => {
      setLoading(true);
      try {
        const currAgentString = localStorage.getItem("currAgent"); // Retrieve currAgent from local storage
        if (!currAgentString) {
          throw new Error("No currAgent found in local storage");
        }

        const currAgent = JSON.parse(currAgentString); // Parse the JSON string into an object
        const poData = currAgent.poData; // Extract poData from currAgent

        const data = await handleIcoList(poData);
        setIcoList(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchIcoList();
  }, [setLoading]);

  const handleChange = async (event, value) => {
    const newSelectedIcos = value.filter((ico) => !selectedIcos.includes(ico));
    const deselectedIcos = selectedIcos.filter((ico) => !value.includes(ico));

    setSelectedIcos(value);

    if (newSelectedIcos.length > 0) {
      const currAgentString = localStorage.getItem("currAgent");
      const currAgent = JSON.parse(currAgentString);
      const poData = currAgent.poData;

      const newDetails = await Promise.all(
        newSelectedIcos.map(async (selectedIco) => {
          const postData = {
            icoKey: selectedIco,
            agent: poData,
          };
          try {
            const response = await handleIcoDetails(postData);
            return {
              piObject: selectedIco,
              artifactName: response?.iflowName,
              description: response?.description,
            };
          } catch (error) {
            console.error("Error fetching ICO details:", error);
            return { name: "", description: "" };
          }
        })
      );

      setIcoDetails((prevDetails) => [...prevDetails, ...newDetails]);
    }

    if (deselectedIcos.length > 0) {
      setIcoDetails((prevDetails) =>
        prevDetails.filter(
          (detail) => !deselectedIcos.includes(detail.piObject)
        )
      );
    }
  };

  useEffect(() => {
    onIcoDetailsReceived(icoDetails);
  }, [icoDetails, onIcoDetailsReceived]);

  const renderTags = (value, getTagProps) => {
    const maxTags = 1;
    return (
      <>
        {value.slice(0, maxTags).map((option, index) => (
          <Chip key={index} label={option} {...getTagProps({ index })} />
        ))}
        {value.length > maxTags && `+${value.length - maxTags} more`}
      </>
    );
  };

  return (
    <div className="w-full">
      <label className="block mb-1 text-sm">
        Select ICOs<span className="text-red-600">*</span>
      </label>
      <Autocomplete
        fullWidth
        multiple
        options={icoList}
        disableCloseOnSelect
        size="small"
        getOptionLabel={(option) => option}
        value={selectedIcos}
        onChange={handleChange}
        renderTags={renderTags}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={selectedIcos.length === 0 ? "Select ICOs" : ""}
            InputProps={{
              ...params.InputProps,
              style: {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        )}
        sx={{
          "& .MuiInputBase-input": {
            height: "1.8em",
            padding: "6px 12px",
            fontSize: 14,
            maxWidth: "calc(100% - 40px)", // Adjusting the max width of the input
          },
        }}
      />
    </div>
  );
};

Ico.propTypes = {
  onIcoDetailsReceived: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default Ico;
