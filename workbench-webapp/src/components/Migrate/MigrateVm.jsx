import React, { useState, useEffect } from "react";
import { RiSearchLine } from "react-icons/ri";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { migrateValueMapping, valueMappingList } from "../../apis/apiService"; // Import the function from api.js
import Package from "./Package";
import { Link } from "react-router-dom";

const PAGE_SIZE = 4;
const VISIBLE_PAGE_NUMBERS = 3;

const TableWithPagination = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePages, setVisiblePages] = useState([1, 2, 3]);


  const handleDropDownChange = (value) => setSelectedValue(value?.id);

  const handleMigrate = () => {
    const storedCurrAgent = localStorage.getItem("currAgent");
    const currAgent = storedCurrAgent ? JSON.parse(storedCurrAgent) : null;

    const payload = {
      poAgent: currAgent.poData,
      apiAgent: currAgent.apiData,
      migrationDetails: {
        valueMappingObject: tableData.filter((row) => row.checked).map((row) => ({
          agency: row.agencyName,
          name: row.valueMapping,
          id: row.groupid
        })),
        packageId: selectedValue,
        integrationName: inputValue,
        description: "fgffff"
      }
    }

    const response = migrateValueMapping(payload);
    console.log(response);

    console.log(payload);
  }

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchData = async () => {
      // Retrieve currAgent from local storage
      const currAgent = JSON.parse(localStorage.getItem("currAgent"));
      if (currAgent && currAgent.poData) {
        const fetchedData = await valueMappingList(currAgent.poData);
        // Transform the fetched data into the format required by the table
        const formattedData = fetchedData.map((item) => ({
          groupid: item.groupid,
          agencyName: item.agency,
          valueMapping: item.groupname,
          checked: false,
        }));
        setTableData(formattedData);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("checkboxState"));
    if (savedState) {
      setTableData((prevData) =>
        prevData.map((row) => ({
          ...row,
          checked: savedState[row.groupid] ? savedState[row.groupid] : false,
        }))
      );
    }
  }, []);

  useEffect(() => {
    const checkboxState = tableData.reduce((acc, curr) => {
      acc[curr.groupid] = curr.checked;
      return acc;
    }, {});
    localStorage.setItem("checkboxState", JSON.stringify(checkboxState));
  }, [tableData]);

  const handleCheckboxChange = (groupid) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.groupid === groupid ? { ...row, checked: !row.checked } : row
      )
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const totalPages = Math.ceil(tableData.length / PAGE_SIZE);
    const newVisiblePages = [];

    if (page <= VISIBLE_PAGE_NUMBERS) {
      for (let i = 1; i <= Math.min(totalPages, VISIBLE_PAGE_NUMBERS); i++) {
        newVisiblePages.push(i);
      }
    } else if (page > totalPages - VISIBLE_PAGE_NUMBERS) {
      for (
        let i = totalPages - VISIBLE_PAGE_NUMBERS + 1;
        i <= totalPages;
        i++
      ) {
        newVisiblePages.push(i);
      }
    } else {
      for (let i = page - 1; i <= page + 1; i++) {
        newVisiblePages.push(i);
      }
    }
    setVisiblePages(newVisiblePages);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setTableData((prevData) =>
      prevData.map((row) => ({
        ...row,
        checked: isChecked,
      }))
    );
  };

  const visibleData = tableData
    .filter((row) =>
      row.agencyName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const anyRowSelected = tableData.some((row) => row.checked);

  return (
    <>
      <div className="border-2 border-[#E5E5E5] m-5 rounded-sm">
        <div className="relative p-3">
          <input
            type="text"
            placeholder="Search by agency name"
            className="w-[30%] border-2 border-[#E5E5E5] pl-10 p-2 rounded text-sm focus:outline-[#1976D2]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">
            <RiSearchLine />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#F2F2F2] border-y-2 border-[#E5E5E5] text-sm">
              <th
                style={{ width: "5%" }}
                className="border-r-2 border-[#E5E5E5]"
              >
                <input
                  type="checkbox"
                  checked={tableData.every((row) => row.checked)}
                  className="h-4 w-4"
                  onChange={handleSelectAll}
                />
              </th>
              <th className="w-1/2 text-left p-3 border-r-2 border-[#E5E5E5] text-[#32363A]">
                AGENCY NAME
              </th>
              <th className="w-1/2 text-left p-3 text-[#32363A]">
                VALUE MAPPING GROUP
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {visibleData.map((row) => (
              <tr
                key={row.groupid}
                className={row.checked ? "bg-blue-200" : ""}
              >
                <td
                  style={{ width: "5%" }}
                  className="text-center border-r-2 border-[#E5E5E5]"
                >
                  <input
                    type="checkbox"
                    checked={row.checked}
                    className="h-4 w-4"
                    onChange={() => handleCheckboxChange(row.groupid)}
                  />
                </td>
                <td className="w-1/2 p-3 border-r-2 border-[#E5E5E5]">
                  {row.agencyName}
                </td>
                <td className="w-1/2 p-3">
                  {row.valueMapping} <span className="m-1">|</span>{" "}
                  {row.groupid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end border-t-2 border-[#E5E5E5] p-3">
          <div className="flex justify-between w-[18%]">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="text-3xl text-[#DDEBF8] hover:text-[#87c5ff]"
            >
              <FaCircleChevronLeft />
            </button>
            {visiblePages.map((page) => (
              <button
                className={`rounded-full px-3 py-1 mr-1 text-sm ${
                  currentPage === page ? "bg-[#CCCCCC]" : "bg-[#F2F2F2]"
                }`}
                key={page}
                disabled={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === Math.ceil(tableData.length / PAGE_SIZE)}
              onClick={() => handlePageChange(currentPage + 1)}
              className="text-3xl text-[#DDEBF8] hover:text-[#87c5ff]"
            >
              <FaCircleChevronRight />
            </button>
          </div>
        </div>
      </div>
      {anyRowSelected && (
        <div className="m-5 flex justify-between items-center">
          <div className="flex-1">
            <label className="block text-sm mb-1 ml-1">
              Value Mapping Name<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="E.g- VM_IDOC_Handlers"
              className="w-full border border-[#A2A2A2] p-2 rounded text-sm mr-2 h-[42px] focus:outline-[#1976D2]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="flex-1 ml-2">
            <Package
              onSelect={handleDropDownChange}
              setLoading={setIsLoading}
              refreshList={refresh}
            />
          </div>
        </div>
      )}
      <footer
        className="border-t text-[#32363A] flex flex-row items-center justify-end gap-2 py-4 h-[60px] bg-white"
        style={{ position: "fixed", bottom: 50, left: 0, right: 0 }}
      >
        <Link to="/migrationProcess">
          <button className="border border-[#0A6ED1] text-[#0A6ED1] rounded-sm px-3 py-1 text-sm hover:text-white hover:bg-[#0A6ED1] transition duration-200 ">
            Back
          </button>
        </Link>

        <span title="Migrate ICOs to IS">
          <button
            className="bg-[#0A6ED1] rounded-sm px-6 py-1 transition duration-200 mr-3 text-white border border-[#0A6ED1] text-sm"
            onClick={handleMigrate}
          >
            Migrate
          </button>
        </span>
      </footer>
    </>
  );
};

export default TableWithPagination;
