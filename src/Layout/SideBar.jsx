/* eslint-disable react/prop-types */
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useLocation, useNavigate } from "react-router-dom";
import { GoHome, GoInfo } from "react-icons/go";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { TbSettingsSearch } from "react-icons/tb";
import { GiSpeedometer } from "react-icons/gi";
import { BsTelephone } from "react-icons/bs";
import { CiSquareQuestion } from "react-icons/ci";
import { RiFileCloudLine } from "react-icons/ri";

const SideBar = () => {
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const styles = {
    listItem: {
      margin: "6px",
      borderRadius: "4px",
      backgroundColor: "#F2F2F2",
      "&:hover": {
        backgroundColor: "#0A6ED1",
        color: "white",
      },
    },
    selectedItem: {
      backgroundColor: "#0A6ED1",
      color: "white",
      margin: "6px",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#0A6ED1",
        color: "white",
      },
    },
  };

  //   const drawerWidth = drawerState ? 200 : 55;
  const drawerWidth = 230;

  


  const location = useLocation();
  let navigate = useNavigate();
  const isActiveRoute = (route) => {
    return location.pathname.includes(route);
  };

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiPaper-root`]: {
            width: drawerWidth,
            zIndex: 95,
            boxSizing: "border-box",
            // backgroundColor: "#2A4862",
            // color: "white",
            fontSize: "13px",
            transition: "width 0.3s ease",
            overflow: "hidden",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />

        <List sx={{marginTop:"-10px"}}>
          <ListItem
            disablePadding
            onClick={() => {
              navigate("/home");
              setOpenSubmenu(false);
            }}
          >
            <ListItemButton
              sx={
                isActiveRoute("/home") ? styles.selectedItem : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <GoHome size={20} />
              <span className=" gap-4 ">Home</span>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={() => {
                navigate("/migrationAssessment");
                setOpenSubmenu(false);
            }}
          >
            <ListItemButton
              sx={
                isActiveRoute("/migrationAssessment") 
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <RiFileCloudLine size={20} className=" " />
              <span className=" gap-4 ">Migration Assessment </span>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={() => {
              //   handleItemClick("Migration Process");
              navigate("/migrationProcess");
              setOpenSubmenu(!openSubmenu);
            }}
          >
            <ListItemButton
              sx={
                isActiveRoute("/migrationProcess")
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <AiOutlineCloudUpload size={20} className=" " />
              <span className=" gap-4 ">Migration Process </span>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={() =>{ navigate("/automatedTesting");
            setOpenSubmenu(false);}}
          >
            <ListItemButton
              sx={
                isActiveRoute("/automatedTesting")
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <TbSettingsSearch size={20} className=" " />
              <span className=" gap-4 ">Automated Testing</span>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={() => {navigate("/accelarator");
            setOpenSubmenu(false);}}
          >
            <ListItemButton
              sx={
                isActiveRoute("/accelarator")
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <GiSpeedometer size={20} className=" " />
              <span className=" gap-4 ">Accelerator </span>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => {navigate("/about");
              setOpenSubmenu(false);}}>
            <ListItemButton
              sx={
                isActiveRoute("/about") ? styles.selectedItem : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <GoInfo size={20} className=" " />
              <span className=" gap-4 ">About</span>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => {navigate("/contacts");
              setOpenSubmenu(false);}}>
            <ListItemButton
              sx={
                isActiveRoute("/contacts")
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <BsTelephone size={20} className=" " />
              <span className=" gap-4 ">Contacts</span>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => {navigate("/faqs");
              setOpenSubmenu(false);}}>
            <ListItemButton
              sx={
                isActiveRoute("/faqs")
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <CiSquareQuestion size={20} className=" " />
              <span className=" gap-4 ">FAQS</span>
            </ListItemButton>
          </ListItem>
          {/* ))} */}
        </List>
      </Drawer>
      
    </>
  );
};

export default SideBar;
