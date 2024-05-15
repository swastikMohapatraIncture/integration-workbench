import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";


// eslint-disable-next-line react/prop-types
const Header = ({ drawerState, setDrawerState }) => {
  return (
    <>
      <AppBar
        position="fixed"
        className="min-h-[50px] max-h-[50px]"
        sx={{
          zIndex: 1000,
          backgroundColor: "#2A4862",
          color: "white",
          minHeight: "50px",
          maxHeight: "50px",
          boxShadow: "none",
        }}
      >
        <Toolbar
          style={{
            minHeight: "50px",
            maxHeight: "50px",
            "@media (min-width: 600px)": {
              minHeight: "50px",
              maxHeight: "50px",
            },
          }}
          className="text-white min-h-[50px] max-h-[50px] ml-[-15px]  gap-5"
        >
          <IconButton
            aria-label="delete"
            sx={{ color: "white" }}
            onClick={() => setDrawerState(!drawerState)}
          >
            {drawerState ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <h2 className="text-sm md:text-2xl text-left text-white py-2 px-4">
              Incture Integration Workbench
            </h2>
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
