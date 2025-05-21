import { useState, useEffect } from "react";
import AddTask from "../components/AddTask";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import { UPDATE_TASK_STATUS } from "../graphql/mutations";
import "../App.css";
const Tasks = ({currentUser}) => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name");


  const handleClick = () => {
    setIsAddTaskOpen(!isAddTaskOpen);
  }

  const { data: data , refetch} = useQuery(GET_TASKS);
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  useEffect(() => {

  }, [data]);
  
const processedTasks = data?.getTasks?.map((task) => {
  const cloned = { ...task };

  const timestamp = Number(cloned.dueDate);
  const date = new Date(timestamp).toLocaleDateString();
  cloned.dueDateFormatted = date;
  return cloned;
}) || [];

  const filteredTasks = 
  currentUser.isStudent === true 
  ? processedTasks.filter((task) => task.assignedStudents.includes(currentUser.username)) 
  : processedTasks

  filteredTasks.sort((a, b) => {
    if (sortBy === "taskStatus") {
      return a.status.localeCompare(b.status);
    } else if (sortBy === "taskProject") {
      return a.project.localeCompare(b.project);
    } else if (sortBy === "taskName") {
      return a.name.localeCompare(b.name);
    }  else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "taskDueDate") {
      return a.dueDateObject - b.dueDateObject;
    } else if (sortBy === "taskAssignedstudents") {
      return a.assignedStudents[0]?.localeCompare(b.assignedStudents[0] || "");
    }else {
          return a.name.localeCompare(b.name);
    }
  });

  const statusOrder = ["Pending", "In Progress", "On Hold", "Completed", "Cancelled"];

  const handleStatus = async (task) => {
    if (currentUser.isStudent === true ){
      alert("You are not allowed to change the status of this task");
    } else {
      const currentIndex = statusOrder.indexOf(task.status);
      const nextIndex = (currentIndex + 1) % statusOrder.length;
      const nextStatus = statusOrder[nextIndex];
      try {
        await updateTaskStatus({ variables: { id: String(task.id), status: nextStatus } });
        refetch();
      } catch (err) {
        alert("Failed to update status: " + err.message);
        console.error(err);
      }
    }
    
  }
  const handleClose = () => {
    setIsAddTaskOpen(false);
  }
  return (
    <>
      <div className="bg-[#00033a] w-screen h-screen p-4 m-0 flex flex-col">
        <h2 className="text-yellow-500 font-bold text-3xl">Tasks</h2>
        <div className="flex justify-between items-center mt-4">
          <div className="flex ">
            <p className="text-white">Sort By: </p>
            <select className="bg-blue-900 text-white p-1 rounded-md gap-2 ml-2" onChange={(e) => setSortBy(e.target.value)}>
              <option value={"taskName"}>Task name</option>
              <option value="taskStatus">Task status</option>
              <option value="taskProject">Project</option>
              <option value="taskDueDate">Due date</option>
              <option value="taskAssignedstudents">Assigned students</option>
            </select>
          </div>
          <button className={`cursor-pointer text-blue-950 bg-yellow-500 rounded font-bold w-50 mt-3 ${
            currentUser.isStudent ? "hidden" : ""}`} onClick={handleClick}>Create a New Task</button>
        </div>
        <table className="w-full mt-4 border border-gray-300 rounded-full overflow-scroll">
          <thead>
            <tr className="bg-blue-950 text-white">
              <th className="p-2 text-left">Task Name</th>
              <th className="p-2 text-left">Project</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Assigned Students</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border bg-blue-950 text-white">
                <td className="p-2 text-left">{task.name}</td>
                <td className="p-2 text-left">{task.project}</td>
                <td className="p-2 text-left">{task.description}</td>
                <td className="p-2 text-left">{task.dueDateFormatted}</td>
                <td className="p-2 text-center">{task.assignedStudents.join(", ")}</td>
                <td>
                  <button
                    className={
                      `p-2 text-left font-bold ` +
                      (task.status === "In Progress"
                        ? "text-yellow-500"
                        : task.status === "On Hold"
                        ? "text-gray-500"
                        : task.status === "Pending"
                        ? "text-blue-500"
                        : task.status === "Cancelled"
                        ? "text-red-500"
                        : "text-green-500")
                    }
                    onClick={() => handleStatus(task)}
                  >
                    {task.status}
                  </button>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
      <AddTask isOpen={isAddTaskOpen} onClose={handleClose}  refetchTasks={refetch}/>

    </>
    
  );
}
export default Tasks;