const VMReport = ({ inputValue, isOpen, base64Url, onClose }) => {
    console.log(inputValue);

  const downloadReport = () => {
    const blob = b64toBlob(base64Url, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
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
      { isOpen && 
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white rounded-sm shadow-lg w-1/3 z-[10000]">
          <div className="border-b px-4 py-2 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#32363A]">
              Value Mapping Migration Status
            </h3>
            {/* <button onClick={onClose} className="text-gray-600 hover:text-gray-800">&times;</button> */}
          </div>
          <div className="p-4">
            <p>
                <strong>{inputValue}</strong> has been migrated successfully to Integration Suite.
                {/* <strong>Value Mapping Name : </strong> {inputValue} */}
            </p>
            {/* <p><strong>Base64 Data:</strong> {response.base64}</p> */}
          </div>
          <div className="border-t px-4 py-2 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-1 rounded-sm text-sm hover:bg-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              //   onClick={downloadReport}
              className="bg-[#0A6ED1] text-white px-4 py-1 rounded-sm text-sm hover:bg-blue-700
              "
              onClick={downloadReport}
            >
              Download
            </button>
          </div>
        </div>
      </div>
      }
    </>
  );
};

export default VMReport;
