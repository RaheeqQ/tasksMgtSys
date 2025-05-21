import { useEffect , useState } from "react";
import "../App.css";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "../graphql/queries";
import ProjectCard from "../components/ProjectCard";
import AddProject from "../components/AddProject";

export function calculateProgress(project) {
  const currentDate = new Date();
  const start = new Date(Number(project.startDate));
  const end = new Date(Number(project.endDate));

  const convertToString = (date) => new Date(date.toDateString());
  const currentString = convertToString(currentDate);
  const startString = convertToString(start);
  const endString = convertToString(end);

  let status, progress;
  if (currentString < endString) {
    status = "In Progress";
    const total = endString - startString;
    const elapsed = currentString - startString;
    progress = Math.min((elapsed / total) * 100, 100);
    if (progress < 0)
      progress = 0
  } else if (currentString.getTime() === endString.getTime()) {
    status = "Pending";
    progress = 100;
  } 
  else {
    status = "Completed";
    progress = 100;
  }

  return { ...project, status, progress: Math.round(progress) };
}


function Project({currentUser}) {

  const [isAddProjOpen, setIsAddProjOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClick = () => {
      setIsAddProjOpen(!isAddProjOpen);
  };
  const handleClose = () => {
    setIsAddProjOpen(false);
  };

  const [criteria, setCriteria] = useState("all");

  const { data: data , refetch} = useQuery(GET_PROJECTS);

  useEffect(() => {

  }, [data]);
  const processedProjects = data?.getProjects?.map((project) => {
    const cloned =  calculateProgress(project) ;

    return cloned;
  }) || [];


  let studentProjects = [];
  if (currentUser.isStudent) {
    studentProjects = processedProjects.filter((project) => project.assignedStudents.includes(currentUser.username))
  }


  const allProjects = currentUser.isStudent ? studentProjects : processedProjects;
  let filteredProjects =
    criteria === "all"
      ? allProjects
      : allProjects.filter(
          (project) =>
            project.status.toLowerCase().replace(" ", "-") === criteria
        );

  if (searchTerm !== "")
  {
    filteredProjects = allProjects.filter((project) => project.name.includes(searchTerm))
  }
  return (
    <>
      <div className="bg-[#00033a] text-white w-screen h-screen p-8 overflow-auto">
        <h2 className="text-2xl text-yellow-500 font-bold">Projects Overview</h2>

        <div className="flex gap-4 mb-4">
          <button className={`cursor-pointer text-blue-950 bg-yellow-500 rounded font-bold w-50 mt-3 ${
            currentUser.isStudent ? "hidden" : ""}`}
            onClick={handleClick}> Add Project </button>
          <input
            type="text"
            placeholder="Search projects by title or description..."
            className="w-full px-4 py-2 rounded text-blue-950 bg-white mt-3"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="rounded text-blue-950 bg-white mt-3 p-2"
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            required
          >
            <option value="all">All Statuses</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="on-hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-stretch justify-center flex-wrap gap-4">
          {filteredProjects.map((project) => (
            <div key={project.id}>
              <ProjectCard refetchProjects={refetch} currentUser={currentUser} {...project} />
            </div>
          ))}
        </div>
      </div>
      <AddProject isOpen={isAddProjOpen} onClose={handleClose} refetchTasks={refetch}/>
    </>
  );
}

export default Project;
