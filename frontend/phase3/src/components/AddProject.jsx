import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/queries";
import "../App.css";


const categoryOptions = ["Web Development", "Mobile Development", "Data Science", "Machine Learning"];


const AddProject = ({isOpen, onClose, refetchTasks}) => {
    if (!isOpen) return null;
    
    const {data: dataUser} = useQuery(GET_USERS);
        
    const users = dataUser?.getUsers?.map((user) => {
        const cloned =  {...user}; 
        return {
            id: cloned.id,
            username: cloned.username,
            password: cloned.password,
            isStudent: cloned.isStudent,
            universityID: cloned.universityID
        };
    }) || [];
    const studentOptions = users.filter((user) => user.isStudent).map((user) => user.username);
        
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const assignedStudents = [];
        studentOptions.forEach((student) => {
            if (formData.get(student)) {
                assignedStudents.push(student);
            }
        });

        if (formData.get("startDate") > formData.get("endDate")) {
            alert("Start date cannot be after end date.");
            return;
        }
        const data = {
            name: formData.get("title"),
            description: formData.get("description"),
            assignedStudents,
            category: formData.get("category"),
            startDate: formData.get("startDate").toString(),
            endDate: formData.get("endDate").toString(),
        };
        
        console.log(data);
        try {
            const response = await fetch("http://localhost:4000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                mutation AddProject($project: ProjectInput) {
                    addProject(project: $project) {
                    name
                    }
                }
                `,
                variables: { project: data }
            })
            });

            
            if (response.ok) {
                event.target.reset()
                refetchTasks()
                onClose()
            } else {
                alert("Failed to add project.")
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
                    <h2 className="text-xl font-bold text-yellow-400 mb-">Add New Project</h2>
                    
                    <form className=" bg-blue text-white p-6 rounded max-w-md w-full space-y-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-start">
                        <label className="block mb-1">Project Title:</label>
                        <input type="text" name="title" className="bg-blue-900 w-full p-2 rounded border border-white" required />
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="block mb-1">Project Description:</label>
                        <textarea name="description" className="bg-blue-900 w-full p-2 rounded border border-white" />
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="block mb-1">Students List:</label>
                        <div className="flex space-y-1 flex-wrap gap-4">
                            {studentOptions.map((student, index) => (
                                <label key={index} className="flex items-center space-x-2">
                                    <input type="checkbox" name={student} value={student} />
                                    <span>{student}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="block mb-1">Project Category:</label>
                        <select name="category" className="bg-blue-900 w-full p-2 border border-white rounded" required>
                            <option value="">Select a category</option>
                            {categoryOptions.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="block mb-1">Starting Date:</label>
                        <input type="date" name="startDate" className="bg-blue-900 w-full p-2 border border-white rounded" required />
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="block mb-1">Ending Date:</label>
                        <input type="date" name="endDate" className="bg-blue-900 w-full p-2 border border-white rounded" required />
                    </div>


                    <button type="submit" className="w-full py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600">Add Project</button>
                </form>
                            </div>
            </div>
        </>
    );
}

export default AddProject;