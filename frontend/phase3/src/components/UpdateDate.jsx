// components/UpdateDate.js
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT_STATUS } from "../graphql/mutations";

function UpdateDate({ id, endDate, onClose, refetchProjects }) {
  const [newEnd, setNewEnd] = useState(endDate);

  const [updateProjectDueDate] = useMutation(UPDATE_PROJECT_STATUS);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProjectDueDate({
        variables: {
          id,
          endDate: String(newEnd),
        },
      });
      refetchProjects();
      onClose();
    } catch (error) {
      console.error("Update error:", error.message);
      alert("Failed to update project dates.");
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-opacity-50 backdrop-blur-sm flex items-center justify-center px-2">
      <div className="flex flex-col justify-between bg-blue-900 p-6 rounded-lg h-64 w-128 text-black">
        <h2 className="text-3xl text-white font-bold mb-4">Update Project Dates</h2>
        <form className="flex flex-col justify-between"onSubmit={handleSubmit}>
        

          <label className="block text-xl text-white mb-2">End Date:</label>
          <input
            type="date"
            className="border border-white text-white rounded p-2 w-full mb-4"
            value={new Date(Number(newEnd)).toISOString().split("T")[0]}
            onChange={(e) => setNewEnd(new Date(e.target.value).getTime())}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-60 bg-gray-300 text-blue-900 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="w-60 bg-yellow-500 text-blue-900 px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateDate;
