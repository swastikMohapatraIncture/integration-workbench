import { MdOutlineModeEdit } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { ImCancelCircle } from "react-icons/im";
import { useState } from "react";

const splitName = (name) => {
  const maxCharactersPerLine = 45;

  if (!name) {
    return "";
  }

  if (name.length > maxCharactersPerLine) {
    return (
      <>
        {name
          .match(new RegExp(`.{1,${maxCharactersPerLine}}`, "g"))
          .map((line, index) => (
            <div key={index}>{line}</div>
          ))}
      </>
    );
  } else {
    return name;
  }
};

const DetailsTable = ({ icoDetails, setIcoDetails }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleEdit = (index, detail) => {
    setEditIndex(index);
    setEditName(detail.artifactName);
    setEditDescription(detail.description);
  };

  const handleSave = (index) => {
    const updatedDetails = [...icoDetails];
    updatedDetails[index].artifactName = editName;
    updatedDetails[index].description = editDescription;
    setIcoDetails(updatedDetails);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  return (
    <div className="overflow-x-auto p-3 text-sm">
      <table className="table-auto w-full text-[#32363A]">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-200 px-2 py-2 text-center w-[5%]">
              No.
            </th>
            <th className="border border-gray-200 px-2 py-2 w-[20%] text-left">
              Iflow Name
            </th>
            <th className="border border-gray-200 px-2 py-2 w-[20%] text-left">
              Description
            </th>
            <th className="border border-gray-200 px-2 py-2 text-left w-[5%]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="max-h-40 overflow-y-auto border">
          {icoDetails?.map((detail, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-200 overflow-hidden px-2">
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300"
                  />
                ) : (
                  splitName(detail.artifactName)
                )}
              </td>
              <td className="border border-gray-200 overflow-hidden px-2 h-20">
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300"
                  />
                ) : (
                  detail.description
                )}
              </td>
              <td className="border-b overflow-hidden py-8 flex justify-evenly items-center">
                {editIndex === index ? (
                  <>
                    <button
                      className="text-green-500 mx-6 text-2xl"
                      onClick={() => handleSave(index)}
                    >
                      <FaRegCircleCheck />
                    </button>
                    <button
                      className="text-red-600 text-2xl"
                      onClick={handleCancel}
                    >
                      <ImCancelCircle />
                    </button>
                  </>
                ) : (
                  <button
                    className=" text-white px-2 py-1 ml-6"
                    onClick={() => handleEdit(index, detail)}
                  >
                    <span title="Edit Name/Description">
                      <MdOutlineModeEdit className="text-blue-600 text-xl" />
                    </span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailsTable;
