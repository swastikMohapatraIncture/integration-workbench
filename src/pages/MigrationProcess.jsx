import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import WorkInProg from '../components/WorkInProg/WorkInProg';
import MainPageMP from "../components/MigrationProcess/MainPageMP";
import Introduction from "../components/NeoToCloudFoundry/Introduction";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MigrationProcess = () => {
  const [value, setValue] = useState(0);
  const [agentSelected, setAgentSelected] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            sx={{ textTransform: "capitalize" }}
            label="PO to Integration Suite"
            {...a11yProps(0)}
          />
          <Tab
            sx={{ textTransform: "capitalize" }}
            label="NEO to Cloud Foundry"
            {...a11yProps(1)}
          />
          {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <MainPageMP
          agentSelected={agentSelected}
          setAgentSelected={setAgentSelected}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Introduction />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel> */}
    </Box>
  );
};

export default MigrationProcess;
