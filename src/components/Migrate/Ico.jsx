import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { handleIcoList, handleIcoDetails } from '../../apis/apiService'; 


const Ico = () => {
  const [icoList, setIcoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIcos, setSelectedIcos] = useState([]);
  const [icoDetails, setIcoDetails] = useState({ names: [], description: [] });


  const poData = {
    name: "IncturePO1",
    username: "INC02525",
    password: "Integration@#1",
    host: "sapserver",
    port: "50000",
    environment: "DEV"
  };

  useEffect(() => {
    const fetchIcoList = () => {
      handleIcoList(poData)
        .then(data => {
          setIcoList(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    };

    fetchIcoList();
  }, []);

  const handleChange = (event, value) => {
    setSelectedIcos(value);

    value.forEach(selectedIco => {
      const postData = {
        poAgent: poData,
        icoKey: selectedIco
      };
      console.log(postData);
      handleIcoDetails(postData)
        .then(details => {
          setIcoDetails(prevDetails => ({
            names: [...prevDetails.names, ...details.names],
            description: [...prevDetails.description, ...details.description]
          }));
        })
        .catch(error => {
          console.error("Error fetching ICO details:", error);
        });
    });
  };

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

  if (loading) return <p>Loading...</p>;
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
        style={{}}
      />
      <div style={{ marginTop: '1rem' }}>
        <h2>ICO Details</h2>
        {icoDetails.names.map((name, index) => (
          <div key={index}>
            <h3>{name}</h3>
            <p>{icoDetails.description[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomPaper = ({ children, ...other }) => {
  return (
    <Paper elevation={3} {...other} style={{ maxHeight: 100, overflow: 'auto' }}>
      {children}
    </Paper>
  );
};


export default Ico;
