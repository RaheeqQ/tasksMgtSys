import { GET_PROJECTS , GET_USERS} from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState, useMemo} from "react";
import "../App.css";

const AddProject = ({isOpen, onClose, refetchTasks}) => {
    if (!isOpen) return null;

    const [selectedProjName, setSelectedProjectName] = useState("")
    const [studentsList, setStudentList] = useState([])

    const { data: data } = useQuery( GET_PROJECTS);
   
   const ProjectsNames = useMemo(() => {
        return data?.getProjects?.map((project) => ({ ...project })) || [];
    }, [data]);

    useEffect(() => {
        const selectedProject = ProjectsNames.find(p => p.name === selectedProjName);
        if (selectedProject) {
            setStudentList(selectedProject.assignedStudents || []);
        } else {
            setStudentList([]);
        }
    }, [selectedProjName, ProjectsNames]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const data = {
            name: formData.get("name"),
            project: formData.get("project"),
            description: formData.get("description"),
            assignedStudents: formData.get("assignedStudent"),
            status: formData.get("status"),
            dueDate: formData.get("endDate").toString(),
        };
        
        try {
            const response = await fetch("http://localhost:4000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                mutation AddTask($task: TaskInput) {
                    addTask(task: $task) {
                    name
                    }
                }
                `,
                variables: { task: data }
            })
            });
            
            if (response.ok) {
                event.target.reset()
                refetchTasks()
                onClose()
            } else {
                alert("Failed to add task.")
            }
        } catch (error) {
            alert("Error: " + error.message)
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-opacity-50 backdrop-blur-sm flex items-center justify-center px-2">
                <div className="relative bg-blue-900 text-white p-4 sm:p-6 rounded shadow-3xl w-full max-w-md sm:max-w-lg z-50">
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
                    <h2 className="text-xl font-bold text-yellow-400">Add New Task</h2>
                    <form className="bg-blue text-white p-6 rounded max-w-md w-full space-y-3" onSubmit={handleSubmit}>
                        
                        <div className="flex flex-col items-start">
                            <label className="block mb-1">Project Title:</label>
                            <select name="project" className="bg-blue-900 w-full p-2 rounded border border-white" onChange={(e) => setSelectedProjectName(e.target.value)}>
                                <option value="">Select a project</option>
                                {ProjectsNames.map((project) => (
                                    <option key={project.id} value={project.name}>{project.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col items-start">
                            <label className="block mb-1">Task Name:</label>
                            <input type="text" name="name" className="bg-blue-900 w-full p-2 rounded border border-white" />
                        </div>
                        <div className="flex flex-col items-start">
                            <label className="block mb-1">Project Description:</label>
                            <textarea name="description" className="bg-blue-900 w-full p-2 rounded border border-white" />
                        </div>

                        <div className="flex flex-col items-start">
                            <label className="block mb-1">Assigned Students:</label>
                            <select name="assignedStudent" className="bg-blue-900 text-white w-full p-2 rounded border border-white">
                                {studentsList.map((student, index) => (
                                <option className="text-white" key={index} value={student}>{student}</option>  
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col items-start">
                            <label className="block mb-1">Task Status:</label>
                            <select name="status" className="bg-blue-900 w-full p-2 rounded border border-white">
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex flex-col items-start">
                            <label className="block mb-1">Due Date:</label>
                            <input type="date" name="endDate" className="bg-blue-900 w-full p-2 border border-white rounded" />
                        </div>

                        <button type="submit" className="w-full py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600">Add Task</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddProject;