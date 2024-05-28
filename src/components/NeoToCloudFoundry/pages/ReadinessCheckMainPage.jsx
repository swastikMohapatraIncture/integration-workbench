import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ReadinessCheckMainPage = () => {
  const data = [
    { method: 'GET', action: 'Check Pre-Package Content', passed: 1, failed: 1 },
    { method: 'GET', action: 'Load List of Custom Packages', passed: 1, failed: 0 },
    { method: 'GET', action: 'Check Version of Integration Flows', passed: 2, failed: 1 },
    { method: 'GET', action: 'Check Version of Value Mappings', passed: 2, failed: 0 },
    { method: 'GET', action: 'Check JMS Resources', passed: 1, failed: 0 },
  ];

  return (
    <div className="flex flex-col p-4">
      <div className="overflow-auto">
        <table className="table-auto w-full text-[#32363A] shadow-lg rounded-lg">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-200 px-4 py-4 text-center w-[10%]">Serial No</th>
              <th className="border border-gray-200 px-4 py-4 w-[40%] text-left">Test Case</th>
              <th className="border border-gray-200 px-4 py-4 text-left w-[10%]">Total</th>
              <th className="border border-gray-200 px-4 py-4 text-left w-[10%]">Passed</th>
              <th className="border border-gray-200 px-4 py-4 text-left w-[10%]">Failed</th>
              <th className="border border-gray-200 px-4 py-4 text-left w-[10%]">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-200 px-4 py-4 text-center">{index + 1}</td>
                <td className="border border-gray-200 px-4 py-4">{row.action}</td>
                <td className="border border-gray-200 px-4 py-4 text-center">{row.passed + row.failed}</td>
                <td className="border border-gray-200 px-4 py-4">{row.passed}</td>
                <td className="border border-gray-200 px-4 py-4">{row.failed}</td>
                <td className="border border-gray-200 px-4 py-4 text-center">
                  {row.failed > 0 ? <FaTimes color="red" /> : <FaCheck color="green" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center py-2 mt-4">
        <button className="bg-[#0A6ED1] text-white rounded p-2 px-8 hover:bg-gray-300 hover:text-black transition duration-200">
          Let's Migrate
        </button>
      </div>
    </div>
  );
};

export default ReadinessCheckMainPage;
