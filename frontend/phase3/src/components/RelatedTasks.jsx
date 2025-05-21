import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import { useEffect } from "react";
const RelatedTasks = ({ currentUser ,project, isOpen, onClose }) => {

    const startDate = new Date(Number(project.startDate)).toLocaleDateString();
    const endDate = new Date(Number(project.endDate)).toLocaleDateString();
    if (!isOpen) {
        return null;
    }

    if (!project) {
        return <div className="text-red-500">Project not found</div>;
    }

   
    console.log(currentUser)
     const { data } = useQuery(GET_TASKS);
   
     useEffect(() => {
   
     }, [data]);
     
   const processedTasks = data?.getTasks?.map((task) => {
     const cloned = { ...task };
   
     const timestamp = Number(cloned.dueDate);
     const date = new Date(timestamp).toLocaleDateString();
     cloned.dueDateFormatted = date;
     return cloned;
   }) || [];

    console.log("Processed Tasks:", processedTasks);

    const relatedTasks = currentUser.isStudent === true
    ? processedTasks.filter(
        (task) => task.project === project.name && task.assignedStudents.includes(currentUser.username)
      )
    : processedTasks.filter((task) => task.project === project.name);

    console.log("Related Tasks:", relatedTasks);

    return (
        <div className="bg-blue-950 text-white min-h-screen p-8 fixed top-0 right-0 w-100 h-full z-10 overflow-y-scroll">
            <svg
                className="absolute top-4 right-4 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                strokeWidth={1.5}
                stroke="currentColor"
                onClick={onClose}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

            <div className="flex flex-col items-start text-left mb-4">
                <h2 className="text-2xl text-yellow-500 font-bold mb-3">{project.name}</h2>
                <p className="mb-1"><strong>Description:</strong> {project.description}</p>
                <p className="mb-1"><strong>Students:</strong> {project.assignedStudents.join(", ")}</p>
                <p className="mb-1"><strong>Category:</strong> {project.category}</p>
                <p className="mb-1"><strong>Start Date:</strong> {startDate}</p>
                <p className="mb-1"><strong>End Date:</strong> {endDate}</p>
            </div>
            <div className="bg-blue-950 flex flex-col gap-4 mt-4">
                <h2 className="text-2xl text-yellow-500 font-bold text-left">Related Tasks</h2>
                {relatedTasks.length === 0 ? (
                    <p className="text-gray-400 text-left">No tasks found for this project.</p>
                ) : null}
                {relatedTasks.map((task, index) => (
                    <div key={index} className="p-4 rounded-lg border-2 border-yellow-500 bg-blue-950 text-white">
                        <h3 className="text-lg font-semibold mb-2 text-left">{task.name}</h3>
                        <p className="mb-1 text-left"><strong>Task Name:</strong> {task.name}</p>
                        <p className="mb-1 text-left"><strong>Description:</strong> {task.description}</p>
                        <p className="mb-1 text-left"><strong>Assigned student:</strong> {task.assignedStudents}</p>
                        <p className="mb-1 text-left"><strong>Status:</strong> {task.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default RelatedTasks;