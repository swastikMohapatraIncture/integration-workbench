import { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MigrateIP from '../components/MigrateIP';
import MigrateSA from '../components/MigrateSA';
import MigrateOA from '../components/MigrateIP copy';

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const NeoMigration = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={{textTransform:"capitalize"}} label="Integration Packages" {...a11yProps(0)} />
          <Tab sx={{textTransform:"capitalize"}} label="Security Artifacts" {...a11yProps(1)} />
          <Tab sx={{textTransform:"capitalize"}} label="Other Artifacts" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <MigrateIP/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MigrateSA/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <MigrateOA/>
      </CustomTabPanel>
    </Box>
  );
}
export default NeoMigration;