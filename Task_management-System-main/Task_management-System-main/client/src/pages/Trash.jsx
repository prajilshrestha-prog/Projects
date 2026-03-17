import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import clsx from "clsx";
import { Title } from "../components/Title";
import Button from "../components/Button";

import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import { useDeleteTaskMutation, useGetTrashedTasksQuery } from "../redux/slices/api/taskApiSilice";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskColor = ({ className }) => (
  <span className={`w-3 h-3 rounded-full ${className}`}></span>
);

const Trash = () => {
  const { data, isLoading, isError, refetch } = useGetTrashedTasksQuery();
  const tasks = data?.tasks || [];
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const deleteAllHandler = async () => {
    try {
      await deleteTask({ id: "all", actionType: "deleteAll" }).unwrap();
      refetch();
    } catch (error) {
      console.error("Delete all error:", error);
    }
  };

  const restoreAllHandler = async () => {
    try {
      await deleteTask({ id: "all", actionType: "restoreAll" }).unwrap();
      refetch();
    } catch (error) {
      console.error("Restore all error:", error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteTask({ id, actionType: "delete" }).unwrap();
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const restoreHandler = async (id) => {
    try {
      await deleteTask({ id, actionType: "restore" }).unwrap();
      refetch();
    } catch (error) {
      console.error("Restore error:", error);
    }
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Stage</th>
        <th className="py-2 line-clamp-1">Modified On</th>
        <th className="py-2 text-right">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-400/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <TaskColor className={TASK_TYPE[item.stage]} />
          <p className="w-full line-clamp-2 text-base text-black dark:text-gray-400">
            {item?.title}
          </p>
        </div>
      </td>

      <td className="py-2 capitalize">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span>{item?.priority}</span>
        </div>
      </td>

      <td className="py-2 capitalize text-center md:text-start">{item?.stage}</td>
      <td className="py-2 text-sm">{new Date(item?.date).toDateString()}</td>

      <td className="py-2 flex gap-1 justify-end">
        <Button
          icon={<MdOutlineRestore className="text-xl text-gray-500" />}
          onClick={() => restoreHandler(item._id)}
          disabled={isDeleting}
        />
        <Button
          icon={<MdDelete className="text-xl text-red-600" />}
          onClick={() => deleteHandler(item._id)}
          disabled={isDeleting}
        />
      </td>
    </tr>
  );

  return (
    <div className="w-full md:px-1 px-0 mb-6">
      <div className="flex items-center justify-between mb-8">
        <Title title="Trashed Tasks" />
        <div className="flex gap-2 md:gap-2 items-center">
          <Button
            label="Restore All"
            icon={<MdOutlineRestore className="text-lg hidden md:flex" />}
            className="flex flex-row-reverse gap-1 items-center text-black text-sm md:text-base"
            onClick={restoreAllHandler}
            disabled={isDeleting}
          />
          <Button
            label="Delete All"
            icon={<MdDelete className="text-lg hidden md:flex" />}
            className="flex flex-row-reverse gap-1 items-center text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5"
            onClick={deleteAllHandler}
            disabled={isDeleting}
          />
        </div>
      </div>

      <div className="bg-white px-2 md:px-6 py-4 shadow-md rounded">
        <div className="overflow-x-auto">
          <table className="w-full mb-5">
            <TableHeader />
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-red-600">
                    Error loading tasks.
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    No trashed tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => <TableRow key={task._id} item={task} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trash;
