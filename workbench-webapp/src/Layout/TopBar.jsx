import { AppBar, Toolbar, Typography } from "@mui/material";
import Incture from "../assets/logos/InctureLogo.svg";
// import InctureLogo from "../assets/InctureLogo.png";
import { BsTelephone } from "react-icons/bs";
import { GoInfo } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { TbMessage2Question } from "react-icons/tb";

// eslint-disable-next-line react/prop-types
const Header = () => {
  return (
    <>
      <AppBar
        position="fixed"
        className="min-h-[50px] max-h-[50px] z-[100]"
        sx={{
          zIndex: 1000,
          backgroundColor: "#2A4862",
          // borderBottom: "2px solid #F1F1F1",
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
          className="text-white min-h-[50px] max-h-[50px] mr-[-15px]  gap-5"
        >
          {/* <IconButton
            aria-label="delete"
            sx={{ color: "white" }}
            onClick={() => setDrawerState(!drawerState)}
          >
            {drawerState ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton> */}
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <h2 className="text-sm md:text-2xl text-left text-white py-2 px-4">
            Integration Workbench
            </h2>
          </Typography> */}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 ">
                <Link to="/">
                  <img src={Incture} className="w-28" alt="Incture logo" />
                </Link>
                {/* <h1>Incture</h1> */}
                <h1 className="text-xl font-normal tracking-wider text-white mt-1">
                  Integration Workbench
                </h1>
              </div>
              <div className="flex flex-row gap-6">
                <Link to="/about">
                  <span title="About Us">
                    <GoInfo size={20} className="cursor-pointer text-white" />
                  </span>
                </Link>
                <Link to="/contacts">
                  <span title="Contact Us">
                    <BsTelephone
                      size={18}
                      className="cursor-pointer text-white"
                    />
                  </span>
                </Link>
                <Link to="/faqs">
                  <span title="Ask Us">
                    <TbMessage2Question
                      size={20}
                      className="text-white cursor-pointer"
                    />
                  </span>
                </Link>

                <CgProfile size={20} className="ml-8 cursor-not-allowed" />
              </div>
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
