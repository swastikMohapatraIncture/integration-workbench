/* eslint-disable react/prop-types */
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import {
  AccountTreeOutlined,
  AssessmentOutlined,
  BugReportOutlined,
  ExpandLess,
  ExpandMore,
  SpeedOutlined,
  StarBorder,
} from "@mui/icons-material";
import { Collapse } from "@mui/material";

const SideBar = ({ drawerState }) => {
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const styles = {
    listItem: {
      "&:hover": {
        backgroundColor: "white",
        color: "black",
      },
    },
    selectedItem: {
      backgroundColor: "white",
      color: "black",
      "&:hover": {
        backgroundColor: "white",
        color: "black",
      },
    },
  };

  const drawerWidth = drawerState ? 200 : 55;

  const handleItemClick = (item) => {
    setOpenSubmenu(false);
    setActiveItem(item);
  };

  const handleToggleMenu = (item) => {
    setActiveItem(item);
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
            backgroundColor: "#2A4862",
            color: "white",
            fontSize: "13px",
            transition: "width 0.3s ease",
            overflow: "hidden"

          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />

        <List>
          <ListItem
            disablePadding
            disabled
            onClick={() => {
              handleItemClick("Migration Assessment");
            }}
          >
            <ListItemButton
              sx={
                activeItem === "Migration Assessment"
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <AssessmentOutlined size={20} className=" " />
              <span className=" gap-4 ">Migration Assessment </span>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={() => {
              handleItemClick("Migration Process");
              setOpenSubmenu(!openSubmenu);
            }}
          >
            <ListItemButton
              sx={
                activeItem === "Migration Process"
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <AccountTreeOutlined size={20} className=" " />
              <span className=" gap-4 ">Migration Process </span>
              {openSubmenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openSubmenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                disablePadding
                onClick={() => handleToggleMenu("PO to Integration Suite")}
              >
                <ListItemButton
                  className="flex flex-row justify-between items-center gap-4"
                  sx={{ pl: 4 }}
                >
                  <StarBorder />
                  <span className=" gap-4 ">PO to Integration Suite </span>
                </ListItemButton>
              </ListItem>
              <ListItem
                disablePadding
                onClick={() => handleToggleMenu("NEO to Cloud Foundry")}
              >
                <ListItemButton
                  className="flex flex-row justify-between items-center gap-4 "
                  sx={{ pl: 4 }}
                >
                  <StarBorder />
                  <span className=" gap-4 ">NEO to Cloud Foundry </span>
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            disablePadding
            onClick={() => handleItemClick("Automated Testing")}
          >
            <ListItemButton
              sx={
                activeItem === "Automated Testing"
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <BugReportOutlined size={20} className=" " />
              <span className=" gap-4 ">Automated Testing</span>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={() => handleItemClick("Accelerator")}
          >
            <ListItemButton
              sx={
                activeItem === "Accelerator"
                  ? styles.selectedItem
                  : styles.listItem
              }
              className="flex flex-row justify-between items-center gap-4"
            >
              <SpeedOutlined size={20} className=" " />
              <span className=" gap-4 ">Accelerator </span>
            </ListItemButton>
          </ListItem>
          {/* ))} */}
        </List>
      </Drawer>
      {/* {openSubmenu && (
        <>
          <div
            style={{ height: "calc(100% - 50px )", fontSize: "14px" }}
            className="left-[200px] w-[210px]  shadow-lg top-[50px] fixed bg-white z-[1200] flex flex-col  py-2 transition-transform duration-300 transform translate-x-0"
          >
            <IconButton
              className="w-fit  font-semibold"
              onClick={() => setOpenSubmenu(false)}
            >
              <MdOutlineArrowBack className="text-primary " size={20} />
            </IconButton>
            <List className="text-primary mx-2 ">
              <ListItem
                onClick={() => {
                  setOpenSubmenu(false);
                  // navigate("/admin/rule-engine");
                }}
                className=" hover:text-white hover:bg-[#2A4862] cursor-pointer"
              >
                <MdEngineering className="mr-2" size={24} />
                <span>PO to Integration Suite </span>
              </ListItem>
              <ListItem
                onClick={() => {
                  setOpenSubmenu(false);
                  // navigate("/admin/all-tasks");
                }}
                className=" hover:text-white hover:bg-[#2A4862] cursor-pointer"
              >
                <MdAdminPanelSettings className="mr-2" size={24} />
                <span>NEO to Cloud Foundry </span>
              </ListItem>
            </List>
          </div>
          <div
            style={{
              width: "calc(100% - 200px)",
              height: "calc(100% - 50px )",
            }}
            className="w-full h-full  bg-gray-200 opacity-60 absolute  top-[50px] left-[200px] z-[1000] "
          ></div>
        </>
      )} */}
    </>
  );
};

export default SideBar;
