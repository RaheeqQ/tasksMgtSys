import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_PROJECT } from "../graphql/mutations";
import RelatedTasks from "./RelatedTasks";
import UpdateDate from "./UpdateDate";

function ProjectCard({ refetchProjects, isStudent,currentUser,  ...project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const [deleteProject] = useMutation(DELETE_PROJECT);

  const handleClick = () => setIsOpen(!isOpen);

  const {
    id,
    name,
    description,
    category,
    assignedStudents = [],
    startDate,
    endDate,
    status,
    progress,
  } = project;

  const formattedStart = new Date(Number(startDate)).toLocaleDateString();
  const formattedEnd = new Date(Number(endDate)).toLocaleDateString();

  console.log(isStudent)
  const handleDelete = async () => {
    try {
      await deleteProject({ variables: { id } });
      refetchProjects();
    } catch (error) {
      console.error("Delete error:", error.message);
      alert("Failed to delete project.");
    }
  };

  const handleUpdate = () => setShowUpdatePopup(true);

  return (
    <>
      <div
        className={`border-2 rounded-lg bg-[#00033a] p-4 mb-4 cursor-pointer transition-transform transform hover:scale-102
          w-sm h-80 flex flex-col justify-between
          ${
            status === "In Progress"
              ? "border-yellow-500"
              : status === "On Hold"
              ? "border-gray-500"
              : status === "Pending"
              ? "border-blue-500"
              : status === "Cancelled"
              ? "border-red-500"
              : "border-green-500"
          } text-white`}
        onClick={handleClick}
      >
        <div className="h-full mb-3 flex flex-col items-start justify-between">
          <h2 className="text-lg font-semibold">{name}</h2>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Assigned Students:</strong> {assignedStudents.join(", ")}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Progress:</strong> {progress}%</p>
        </div>
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300 mb-2">
            <div
              className="bg-blue-800 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-300 mb-1 mt-1">
            <span className="text-base">{formattedStart}</span>
            <span className="text-base">{formattedEnd}</span>
          </div>
        </div>

        {!currentUser.isStudent && (
          <div className="flex justify-between p-2 gap-4">
            <button className="bg-blue-900 px-4 py-2 w-50 rounded-lg" onClick={handleDelete}>
              Delete
            </button>
            <button className="bg-yellow-500 text-blue-950 px-4 py-2 w-50 rounded-lg" onClick={handleUpdate}>
              Update
            </button>
          </div>
        )}
      </div>

      {showUpdatePopup && (
        <UpdateDate
          id={id}
          endDate={endDate}
          onClose={() => setShowUpdatePopup(false)}
          refetchProjects={refetchProjects}
        />
      )}

      <RelatedTasks currentUser={currentUser} project={project} isOpen={isOpen} onClose={handleClick} />
    </>
  );
}

export default ProjectCard;
