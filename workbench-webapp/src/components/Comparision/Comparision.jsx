import { useState } from "react";
import { postFileCompare } from "../../apis/apiService";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  styled,
} from "@mui/material";
import { ToastContainer, Zoom } from "react-toastify";
import { toast } from "react-toastify";
import Loader from "../Loader";

import { MdOutlineFileUpload } from "react-icons/md";

const Comparison = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const sharedStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    alignItems: "center",
    border: "1px solid lightGray",
    borderRadius: 0.7,
    padding: "4px 9px",
    textTransform: "capitalize",
    width: "100%",
    height: "100px",
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
  
    try {
      const result = await postFileCompare(file);
      console.log(result);
      if (result) {
        setResponse(result.payload);
        toast.success("Comparison completed");
        setError(null);
      } else {
        setError("Error uploading file");
        toast.error("Error uploading file");
        setResponse(null);
      }
    } catch (err) {
      setError("Error uploading file");
      toast.error("Error uploading file");
      setResponse(null);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };
  
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const downloadReport = () => {
    const blob = b64toBlob(
      response,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  return (
    <div className="bg-white p-4 min-h-screen">
      <div className="p-4 border border-gray-300 border-dashed rounded-sm">
        <h2 className="text-xl font-bold text-gray-300 mb-2"></h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-2">
            <div className="">
              <Button
                component="label"
                variant="outlined"
                sx={{ ...sharedStyles }}
                startIcon={<MdOutlineFileUpload size={32} />}
              >
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                <label className="text-lg font-medium">{file ? file.name : "Upload excel here"}</label>
              </Button>
            </div>
          </div>
          <span title="please upload a file">
            <div className="flex justify-center mt-4 ">
              <button
                type="submit"
                disabled={!file}
                className={
                  !file
                    ? "bg-[#EEEDEB] text-black rounded-3xl px-4 py-2 w-[15%] cursor-not-allowed"
                    : "bg-[#0A6ED1] text-white rounded-3xl px-4 py-2 hover:bg-gray-300 hover:text-black transition duration-200 w-[15%] hover:cursor-pointer"
                }
              >
                Compare
              </button>
            </div>
          </span>
        </form>
      </div>

      {!error && (
        <Dialog
          open={showModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{"Comparison completed, download report"}</DialogTitle>
          {/* <DialogContent className="text-center">
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Typography>Comparison completed successfully.</Typography>
          )}
        </DialogContent> */}
          <DialogActions className="justify-center">
            <button
              className="border border-[#0A6ED1] text-[#0A6ED1] rounded-sm px-3 py-1 text-sm hover:text-white hover:bg-[#0A6ED1] transition duration-200 "
              onClick={handleCloseModal}
            >
              Close
            </button>

            <button
              className="bg-[#0A6ED1] rounded-sm px-6 py-1 transition duration-200 mr-3 text-white border border-[#0A6ED1] text-sm"
              onClick={downloadReport}
            >
              Download
            </button>
          </DialogActions>
        </Dialog>
      )}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <Loader />
        </div>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
    </div>
  );
};

export default Comparison;
