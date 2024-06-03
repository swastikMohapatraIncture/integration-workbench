import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { readinessCheck } from "../../../apis/apiServiceNeo";

const ReadinessCheckMainPage = () => {
  const [checkData, setCheckData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readinessCheck();
        setCheckData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!checkData) {
    return <div>Error loading data</div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readinessCheck();
        setCheckData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!checkData) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="flex flex-col p-2">
      <div className="overflow-auto">
        <h2 className="text-xl font-bold mb-2">
          System Readiness Check Results Results
        </h2>
        <table className="table-auto w-full text-[#32363A] shadow-lg rounded-lg text-sm">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-200 px-2 py-2 text-center w-[10%]">
                Serial No
              </th>
              <th className="border border-gray-200 px-2 py-2 w-[40%] text-left">
             
                Total Checks
              </th>
              <th className="border border-gray-200 px-2 py-2 text-left w-[10%]">
              
                Total
              </th>
              <th className="border border-gray-200 px-2 py-2 text-left w-[10%]">
                Can Be Migrated
              </th>
              <th className="border border-gray-200 px-2 py-2 text-left w-[10%]">
                Cannot Be Migrated
              </th>
              <th className="border border-gray-200 px-2 py-2 text-left w-[10%]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="border border-gray-200 px-2 py-2 text-center">
                1
              </td>
              <td className="border border-gray-200 px-2 py-2">
                Pre-Packaged Content
              </td>
              <td className="border border-gray-200 px-2 py-2 text-center">
                {checkData.totalPackages}
              </td>
              <td className="border border-gray-200 px-2 py-2 text-center">
                {checkData.totalPackages - checkData.prePkgNotMigrated}
              </td>
              <td className="border border-gray-200 px-2 py-2 text-center">
                {checkData.prePkgNotMigrated}
              </td>
              <td className="border border-gray-200 px-2 py-3 text-center flex justify-center items-center">
                {checkData.prePkgNotMigrated > 0 ? (
                  <FaTimes color="red" />
                ) : (
                  <FaCheck color="green" />
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-2 py-2 text-center">
                2
              </td>
              <td className="border border-gray-200 px-2 py-2">
                Custom Packages
              </td>
              <td className="border border-gray-200 px-2 py-2 text-center">
                {checkData.customPackages}
              </td>
              <td className="border border-gray-200 px-2 py-2 text-center">
                {checkData.customPackages - checkData.custPkgNotMigrated}
              </td>
              <td className="border border-gray-200 px-2 py-2 text-center">
                {checkData.custPkgNotMigrated}
              </td>
              <td className="border border-gray-200 px-2 py-3 text-center flex justify-center items-center">
                {checkData.custPkgNotMigrated > 0 ? (
                  <FaTimes color="red" />
                ) : (
                  <FaCheck color="green" />
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-2 py-2 text-center">
                3
              </td>
              <td className="border border-gray-200 px-2 py-2">
                Check version of Iflows
              </td>
              <td className="border border-gray-200 px-2 py-2 text-center">
                {checkData.packageIds.length}
              </td>
              <td className="border border-gray-200 px-2 py-2 text-center">
                {checkData.versionCanMigrated}
              </td>
              <td className="border border-gray-200 px-2 py-2 text-center">
                {checkData.versionCanNotMigrated}
              </td>
              <td className="border border-gray-200 px-2 py-3 text-center flex justify-center items-center">
                {checkData.versionCanNotMigrated > 0 ? (
                  <FaTimes color="red" />
                ) : (
                  <FaCheck color="green" />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReadinessCheckMainPage;
