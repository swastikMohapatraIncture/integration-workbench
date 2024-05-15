/* eslint-disable react/prop-types */
const TenantModal = ({ setOpenModal }) => {
  return (
    <>
      <div className="fixed inset-0 z-[140] bg-black opacity-50"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[140]  bg-white shadow-md rounded-md">
        <div className="flex items-start bg-tile justify-between px-4 py-3 rounded-t-md">
          <h1 className="text-lg text-white">Your session has expired.</h1>
        </div>
        <div className="px-4 pt-5">
          <div className="text-base mb-3">
           hello world
          </div>
          <div className="flex flex-row-reverse">
            <button
              className="btn-white text-xs px-4 py-2 mb-5 border border-gray-300 rounded"
              onClick={() => setOpenModal(false)}
            >
              close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TenantModal;
