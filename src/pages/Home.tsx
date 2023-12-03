import { useState, useEffect, lazy } from "react";
import User from "../interfaces/user";
const Table = lazy(() => import("../components/Table")) ;

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedRows, setSelectedRows] = useState<string []>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pageSize = 10;

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSearch = () => {
    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage : number) => {
    setCurrentPage(newPage);
  };

  

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  return (
    <div className="search mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 mr-2 rounded-md "
          />
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <div className="p-2 w-fit mr-0 ml-auto">
          <img
            src="/assets/trash.png"
            alt="search"
            className="w-10 md:w-6 cursor-pointer "
            onClick={handleDeleteSelected}
          />
        </div>
      </div>

      <div className="overflow-x-auto shadow-md">
          <Table users={users} filteredUsers={filteredUsers} setUsers={setUsers} setFilteredUsers={setFilteredUsers} selectedRows={selectedRows} setSelectedRows={setSelectedRows} currentPage={currentPage} pageSize={pageSize} />
      </div>

      <div className="mt-6 flex flex-col md:flex-row gap-2 justify-between">
        <div className="flex gap-4 justify-between md:justify-normal">
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={() => handlePageChange(1)}
          >
            First Page
          </button>
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage == 1}
          >
            Previous Page
          </button>
        </div>
        <div>
          {Array.from({
            length: Math.ceil(filteredUsers.length / pageSize),
          }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "font-bold" : ""}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "30px",
                height: "30px",
                margin: "4px 4px",
                cursor: "pointer",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="flex gap-4 justify-between md:justify-normal">
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredUsers.length / pageSize)
            }
          >
            Next Page
          </button>
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={() =>
              handlePageChange(Math.ceil(filteredUsers.length / pageSize))
            }
          >
            Last Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
