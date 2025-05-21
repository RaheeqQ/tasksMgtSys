import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { calculateProgress } from './Projects';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS, GET_TASKS } from '../graphql/queries';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function calculateStatistics(projects, tasks, currentUser) {
  
  const relatedProjects = currentUser.isStudent === false
    ? projects
    : projects.filter(proj => proj.assignedStudents.includes(currentUser.username));

  const relatedTasks = currentUser.isStudent === false
    ? tasks
    : tasks.filter(task => task.assignedStudents.includes(currentUser.username));

  const processedProjects = relatedProjects.map(calculateProgress);

  const numProjects = processedProjects.length;

  const numStudents = new Set(
    processedProjects.flatMap(proj =>
      Array.isArray(proj.assignedStudents)
        ? proj.assignedStudents
        : (proj.assignedStudents || '').split(', ').filter(Boolean)
    )
  ).size;

  const numTasks = relatedTasks.length;
  const numFinishedProjects = processedProjects.filter(proj => proj.status === "Completed").length;

  return {
    projects: numProjects,
    students: numStudents,
    tasks: numTasks,
    finishedProjects: numFinishedProjects
  };
}

const Dashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({ projects: 0, students: 0, tasks: 0, finishedProjects: 0 });
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());

  const { data: projectsData } = useQuery(GET_PROJECTS);
  const { data: tasksData } = useQuery(GET_TASKS);

  useEffect(() => {
    if (projectsData && tasksData) {
      const projects = projectsData.getProjects || [];
      const tasks = tasksData.getTasks || [];

      setStats(calculateStatistics(projects, tasks, currentUser));
      setDateTime(new Date().toLocaleString());
    }
  }, [projectsData, tasksData, currentUser]);

  const data = {
    labels: ['Projects', 'Students', 'Tasks', 'Finished Projects'],
    datasets: [
      {
        label: 'Count',
        data: [stats.projects, stats.students, stats.tasks, stats.finishedProjects],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Admin Dashboard Overview' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
  <div className="min-h-screen w-full bg-[#00033a] text-white">
    <div className="flex flex-col md:flex-row justify-between p-4 md:p-[2%] w-[90%] mx-auto dash-header">
      <h2 className="text-lg md:text-2xl">Welcome to the Task Management System</h2>
      <div
        id="datetime"
        className="font-sans p-4 rounded-md text-center text-white"
      >
        {dateTime}
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-[5%] stats">
      <div className="flex flex-col justify-between items-center text-center bg-[#162647] rounded-md p-4 total">
        <h3 className="text-lg font-semibold">Number of Projects</h3>
        <p id="numOfProjects" className="text-xl">{stats.projects}</p>
      </div>
      <div className="flex flex-col justify-between items-center text-center bg-[#162647] rounded-md p-4 total">
        <h3 className="text-lg font-semibold">Number of Students</h3>
        <p id="numOfStudents" className="text-xl">{stats.students}</p>
      </div>
      <div className="flex flex-col justify-between items-center text-center bg-[#162647] rounded-md p-4 total">
        <h3 className="text-lg font-semibold">Number of Tasks</h3>
        <p id="numOfTasks" className="text-xl">{stats.tasks}</p>
      </div>
      <div className="flex flex-col justify-between items-center text-center bg-[#162647] rounded-md p-4 total">
        <h3 className="text-lg font-semibold">Number of Finished Projects</h3>
        <p id="numOfFinProj" className="text-xl">{stats.finishedProjects}</p>
      </div>
    </div>

    <div className="flex flex-col items-center w-full max-w-3xl mx-auto mt-8 chart-container">
      <p className="mb-4 text-white">Admin DashBoard overview</p>
      <Bar data={data} options={options} />
    </div>
  </div>
);

};

export default Dashboard;