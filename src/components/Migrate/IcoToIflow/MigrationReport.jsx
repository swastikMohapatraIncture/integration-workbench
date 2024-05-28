import React, { useState } from "react";
import { CheckCircle, Cancel } from "@mui/icons-material";

const MigrationReport = ({ isOpen, onClose, responseData, reportBase64 }) => {
  const [search, setSearch] = useState("");
  // console.log("response data", responseData)
  // console.log("report", responseData);
  const filteredData = responseData?.filter((response) => {
    return (
      response?.message?.toLowerCase()?.includes(search?.toLowerCase()) ||
      response?.icoKey?.piObject?.toLowerCase()?.includes(search?.toLowerCase()) ||
      response?.status?.toLowerCase()?.includes(search?.toLowerCase())
    );
  });

  // console.log(filteredData)
  const downloadReport = () => {
    const blob = b64toBlob(
      reportBase64,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "migration_report.xlsx";
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
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] w-full h-full text-sm">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <h3 className="text-lgB border-b p-2 px-4">
                Migration Report
              </h3>
              <div className="bg-white px-2 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div className="flex items-center justify-center">
                      <input
                        type="text"
                        placeholder="Search ICO Name or Message"
                        className="px-3 py-2 border border-gray-300 mb-4 rounded-sm focus:outline-[#0A6ED1]"
                        style={{ width: "100%" }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="relative max-h-48 overflow-y-auto">
                      <table
                        className="border-collapse border border-gray-300 w-full"
                        style={{ tableLayout: "fixed", width: "100%" }}
                      >
                        <thead className="bg-[#F2F2F2] sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider border border-gray-300 text-center">
                              ICO NAME
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider border border-gray-300 text-center">
                              MESSAGE
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider border border-gray-300 text-center">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredData?.map((response, index) => (
                            <tr
                              key={index}
                              className={
                                response.status === "Success"
                                  ? "bg-green-100"
                                  : "bg-red-100"
                              }
                            >
                              <td
                                className="px-6 py-4 whitespace-wrap border border-gray-300"
                                style={{ wordWrap: "break-word" }}
                              >
                                <div className="text-sm text-gray-900">
                                  {response?.icoKey?.piObject}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-wrap border border-gray-300 text-center">
                                <div className="text-sm text-gray-900">
                                  {response?.message}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-wrap border border-gray-300">
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    lineHeight: "1.5rem",
                                  }}
                                >
                                  {response.status === "Success" ? (
                                    <CheckCircle sx={{ color: "green" }} />
                                  ) : (
                                    <Cancel sx={{ color: "red" }} />
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:px-6 sm:flex sm:flex-row-reverse my-2 mb-2 border-t">
                <button
                  type="button"
                  className="bg-[#0A6ED1] rounded-sm px-3 py-1 transition duration-200 text-white border border-[#0A6ED1] text-sm hover:bg-blue-700 ml-2 mt-2"
                  onClick={downloadReport}
                >
                  Download Report
                </button>
                <button
                  type="button"
                  className="bg-white rounded-sm text-[#0A6ED1] border border-[#0A6ED1] px-3 py-1 hover:bg-[#0A6ED1] hover:text-white mt-2"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MigrationReport;
