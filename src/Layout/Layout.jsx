/* eslint-disable react/prop-types */
import  { useState } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

const Layout = ({ children }) => {
  const [drawerState, setDrawerState] = useState(false);
  return (
    <>
      <div className="bg-primary">
      <TopBar drawerState={drawerState} setDrawerState={setDrawerState} />
      <div className="flex flex-row">
        <SideBar drawerState={drawerState} setDrawerState={setDrawerState} />
        <div
          style={{ minWidth: "calc(100vw - 230px)", minHeight: "calc(100vh - 50px)", overflowX:"scroll" }}
          className="bg-primary mt-[50px]">
          <div className="h-full w-full overflow-hidden overflow-y-auto">
            <div className="bg-secondary w-full ">
              {children}
            </div>
          </div> 
        </div>
        </div>
        <footer className="bg-[#F2F2F2] text-black text-center py-4 z-[100]" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          © 2024 Incture. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Layout;
