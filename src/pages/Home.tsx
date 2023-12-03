import { useState, useEffect } from "react";
import User from "../interfaces/user";

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedRows, setSelectedRows] = useState<string []>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingUserName, setEditingUserName] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState<string>("");

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

  const handleSelectAll = () => {
    const allRowsSelected = selectedRows.length === pageSize;
    const newSelectedRows = allRowsSelected
      ? selectedRows.filter(
          (id) =>
            !filteredUsers
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((user) => user.id)
              .includes(id)
        )
      : [
          ...selectedRows,
          ...filteredUsers
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((user) => user.id),
        ];

    setSelectedRows(newSelectedRows);
  };

  const handleSelectRow = (id : string) => {
    const isSelected = selectedRows.includes(id);
    const newSelectedRows = isSelected
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(newSelectedRows);
  };

  const handleEdit = (userId: string) => {
    setEditingUserName(userId);
    const name = users.find((user) => user.id === userId)?.name;
    setEditUserName(name || "");
  };

  const handleSaveEdit = (userId : string, editedName : string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, name: editedName } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditingUserName(null);
  };

  const handleRemove = (id : string) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
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
        <div>
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
        <div className="p-2 shadow-md">
          {" "}
          <img
            src="/assets/trash.png"
            alt="search"
            className="w-6 cursor-pointer "
            onClick={handleDeleteSelected}
          />
        </div>
      </div>

      <div className="pagination relative overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={selectedRows.length === pageSize}
                    onChange={handleSelectAll}
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-sm">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-sm">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-sm">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((user) => (
                <tr
                  key={user.id}
                  className={
                    selectedRows.includes(user.id)
                      ? "bg-gray-700 shadow-sm"
                      : "shadow-sm"
                  }
                >
                  <td className="w-4 p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(user.id)}
                      onChange={() => handleSelectRow(user.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td>
                    {editingUserName === user.id ? (
                      <input
                        type="text"
                        value={editUserName}
                        onChange={(e) => (setEditUserName(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(user.id, editUserName);
                          }
                        }}
                        autoFocus={true}
                      />
                    ) : (
                      user.name
                    )}
                  </td>

                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="flex gap-4 pt-5">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => handleEdit(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                      onClick={() => handleRemove(user.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between">
        <div className="flex gap-4">
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
        <div className="flex gap-4">
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
