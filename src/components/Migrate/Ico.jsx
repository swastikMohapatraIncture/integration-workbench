import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { handleIcoList, handleIcoDetails } from '../../apis/apiService'; 

const Ico = ({ onIcoDetailsReceived, setLoading }) => {
  const [icoList, setIcoList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIcos, setSelectedIcos] = useState([]);
  const [icoDetails, setIcoDetails] = useState([]);

  const poData = {
    name: "IncturePO1",
    username: "INC02525",
    password: "Integration@#1",
    host: "sapserver",
    port: "50000",
    environment: "DEV"
  };

  useEffect(() => {
    const fetchIcoList = async () => {
      setLoading(true);
      try {
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
    const newSelectedIcos = value.filter(ico => !selectedIcos.includes(ico));
    const deselectedIcos = selectedIcos.filter(ico => !value.includes(ico));

    setSelectedIcos(value);

    if (newSelectedIcos.length > 0) {
      const newDetails = await Promise.all(newSelectedIcos.map(async (selectedIco) => {
        const postData = {
          icoKey: selectedIco,
          agent: poData
        };
        try {
          const response = await handleIcoDetails(postData);
          return {
            piObject: selectedIco,
            artifactName: response?.iflowName,
            description: response?.description
          };
        } catch (error) {
          console.error("Error fetching ICO details:", error);
          return { name: '', description: '' };
        }
      }));

      setIcoDetails(prevDetails => [...prevDetails, ...newDetails]);
    }

    if (deselectedIcos.length > 0) {
      setIcoDetails(prevDetails => prevDetails.filter(detail => !deselectedIcos.includes(detail.piObject)));
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

  if (error) return <p>Error loading ICO list: {error.message}</p>;

  return (
    <div className='w-full'>
      <Autocomplete
        fullWidth
        multiple
        options={icoList}
        disableCloseOnSelect
        getOptionLabel={(option) => option}
        value={selectedIcos}
        onChange={handleChange}
        renderTags={renderTags}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select ICOs"
            placeholder="Select multiple ICOs"
          />
        )}
      />
    </div>
  );
};

export default Ico;
