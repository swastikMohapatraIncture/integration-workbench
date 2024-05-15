/* eslint-disable react/prop-types */
import  { useState } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

const Layout = ({ children }) => {
  const [drawerState, setDrawerState] = useState(false);
  return (
    <>
      <div className="bg-primary flex ">
        <TopBar drawerState={drawerState} setDrawerState={setDrawerState} />
        <SideBar drawerState={drawerState} setDrawerState={setDrawerState} />
        <div
          style={{ width: "calc(100vw - 70px)", height: "calc(100vh - 50px)" }}
          className=" overflow-hidden bg-primary mt-[50px]"
        >
          <div className="h-full w-full rounded-tl-xl overflow-hidden   overflow-y-auto">
            <div style={{ minHeight: "100%" }} className="bg-secondary w-full ">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
