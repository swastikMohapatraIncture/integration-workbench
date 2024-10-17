import React from "react";
import Box from "@mui/material/Box";

const Loader = ({
  height = "55vh",
  width = "40px",
  borderWidth = "6px",
  borderColor = "#0a6ed1",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: height,
      }}
    >
      <div className="slow-loader" style={{ width: width }}>
        <style jsx>{`
          .slow-loader {
            border: ${borderWidth} solid #f3f3f3;
            border-radius: 50%;
            border-top: ${borderWidth} solid ${borderColor};
            width: ${width};
            height: ${width};
            animation: spin 2s cubic-bezier(0.26, 1.14, 0.3, 1.13) infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </Box>
  );
};

export default Loader;
