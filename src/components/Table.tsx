import User from "../interfaces/user";
import { Table, Button } from "flowbite-react";
import React, { useState } from "react";

export default function TableComponent({ users, filteredUsers, setUsers, setFilteredUsers, selectedRows, setSelectedRows, currentPage, pageSize }: {
    users: User[];
    filteredUsers: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
    selectedRows: string[];
    setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
    currentPage: number;
    pageSize: number;
}) {

    const [editingUserName, setEditingUserName] = useState<string | null>(null);
    const [editUserName, setEditUserName] = useState<string>("");

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

    const handleSelectRow = (id: string) => {
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

    const handleSaveEdit = (userId: string, editedName: string) => {
        const updatedUsers = users.map((user) =>
            user.id === userId ? { ...user, name: editedName } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setEditingUserName(null);
    };

    const handleRemove = (id: string) => {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
    };

    return (
        <Table>
            <Table.Head>
                <Table.HeadCell scope="col" className="p-4">
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
                </Table.HeadCell>
                <Table.HeadCell scope="col" className="px-6 py-3 text-sm">
                    Name
                </Table.HeadCell>
                <Table.HeadCell scope="col" className="px-6 py-3 text-sm">
                    Email
                </Table.HeadCell>
                <Table.HeadCell scope="col" className="px-6 py-3 text-sm">
                    Role
                </Table.HeadCell>
                <Table.HeadCell scope="col" className="px-6 py-3 text-sm">
                    Action
                </Table.HeadCell>

            </Table.Head>
            <Table.Body>
                {filteredUsers
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((user) => (
                        <Table.Row
                            key={user.id}
                            className={
                                selectedRows.includes(user.id)
                                    ? "bg-gray-700 shadow-sm"
                                    : "shadow-sm"
                            }
                        >
                            <Table.Cell className="w-4 p-4">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(user.id)}
                                    onChange={() => handleSelectRow(user.id)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </Table.Cell>
                            <Table.Cell>
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
                            </Table.Cell>

                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>{user.role}</Table.Cell>
                            <Table.Cell className="flex gap-4 py-2">
                                <Button color="blue" className="my-auto" onClick={()=> handleEdit(user.id)}>Edit</Button>
                                <Button color="red" className="my-auto" onClick={()=> handleRemove(user.id)}>Remove</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
            </Table.Body>
        </Table>
    )
}
