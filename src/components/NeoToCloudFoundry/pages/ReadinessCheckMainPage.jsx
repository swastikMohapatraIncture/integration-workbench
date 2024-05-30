import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const ReadinessCheckMainPage = () => {
  const data = [
    {
      method: "GET",
      action: "Check Pre-Package Content",
      passed: 1,
      failed: 1,
    },
    {
      method: "GET",
      action: "Load List of Custom Packages",
      passed: 1,
      failed: 0,
    },
    {
      method: "GET",
      action: "Check Version of Integration Flows",
      passed: 2,
      failed: 1,
    },
    {
      method: "GET",
      action: "Check Version of Value Mappings",
      passed: 2,
      failed: 0,
    },
    { method: "GET", action: "Check JMS Resources", passed: 1, failed: 0 },
  ];

  return (
    <div className="flex flex-col p-2">
      <div className="overflow-auto">
        <h2 className="text-xl font-bold mb-2">
          System Readiness Check
        </h2>
        <table className="table-auto w-full text-[#32363A] shadow-lg rounded-lg text-sm">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-200 px-2 py-2 text-center w-[11%]">
                Serial No
              </th>
              <th className="border border-gray-200 px-2 py-2 w-[30%] text-left">
                Total Checks
              </th>
              <th className="border border-gray-200 px-2 py-2 text-center w-[8%]">
                Total
              </th>
              <th className="border border-gray-200 px-2 py-2 text-center w-[12%]">
                Can Be Migrated
              </th>
              <th className="border border-gray-200 px-2 py-2 text-center w-[10%]">
                Cannot Be Migrated
              </th>
              <th className="border border-gray-200 px-2 py-2 text-center w-[10%]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-200 px-2 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-200 px-2 py-2">
                  {row.action}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center">
                  {row.passed + row.failed}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center">
                  {row.passed}
                </td>
                <td className="border border-gray-200 px-2 py-2 text-center">
                  {row.failed}
                </td>
                <td className="border border-gray-200 px-2 py-3 flex justify-center items-center">
                  {row.failed > 0 ? (
                    <FaTimes color="red"/>
                  ) : (
                    <FaCheck color="green" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReadinessCheckMainPage;
