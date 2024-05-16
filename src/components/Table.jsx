
const Table = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-5 py-3 border-r border-gray-200"></th>
            <th scope="col" className="px-6 py-3 text-left text-s font-bold text-[#32363A] uppercase tracking-wider border-r border-gray-200">PO Tenant</th>
            <th scope="col" className="px-6 py-3 text-left text-s font-bold  text-[#32363A] uppercase tracking-wider border-r border-gray-200">PO Environment</th>
            <th scope="col" className="px-6 py-3 text-left text-s font-bold  text-[#32363A] uppercase tracking-wider border-r border-gray-200">IS Tenant</th>
            <th scope="col" className="px-6 py-3 text-left text-s font-bold  text-[#32363A] uppercase tracking-wider border-r border-gray-200">IS Environment</th>
            <th scope="col" className="px-6 py-3 text-left text-s font-bold  text-[#32363A] uppercase tracking-wider border-r border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-100">
            <td className=" whitespace-nowrap border-r border-gray-200 text-center"> 
              <input type="radio" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">Data 1</td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">Data 2</td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">Data 3</td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">Data 4</td>
            <td className="px-6 py-4 whitespace-nowrap border-r text-[#32363A]  text-s border-gray-200">
              <button className="text-blue-600 hover:text-blue-900 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.414 5.793l-9 9a1 1 0 101.414 1.414l9-9a1 1 0 00-1.414-1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M13 6a1 1 0 10-2 0v5a1 1 0 102 0V6z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M5.793 13.414l9-9a1 1 0 00-1.414-1.414l-9 9a1 1 0 101.414 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 101.414 1.414L10 11.414l4.293 4.293a1 1 0 101.414-1.414L11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586 5.707 4.293z" clipRule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
          
          {/* Add more rows here */}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
