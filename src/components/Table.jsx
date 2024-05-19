import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const Table = () => {
  return (
    <div className="overflow-x-auto p-6">
      {/* {icoList} */}
      {/* {packageList} */}
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-5 py-3 border-r border-gray-200"></th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-s font-bold text-[#32363A] tracking-wider border-r border-gray-200"
            >
              PO Tenant
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-s font-bold  text-[#32363A] tracking-wider border-r border-gray-200"
            >
              PO Environment
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-s font-bold  text-[#32363A] tracking-wider border-r border-gray-200"
            >
              IS Tenant
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-s font-bold  text-[#32363A] tracking-wider border-r border-gray-200"
            >
              IS Environment
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-s font-bold  text-[#32363A] tracking-wider border-r border-gray-200"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-100">
            <td className=" whitespace-nowrap border-r border-gray-200 text-center">
              <input type="radio" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">
              Data 1
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">
              Data 2
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">
              Data 3
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">
              Data 4
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">
              <button className="text-blue-600 hover:text-blue-900 mr-2">
                <MdOutlineModeEdit className="text-blue-600 text-2xl" />
              </button>
              <button className="text-red-600 hover:text-red-900">
                <RiDeleteBin6Line className="text-red-600 text-2xl" />
              </button>
            </td>
          </tr>

          {/* Add more rows here */}
        </tbody>
      </table>
      <button onClick={() => handleSubmit()}>test</button>
      <button onClick={() => handleMigrate()}>migrate</button>
    </div>
  );
};

export default Table;
