import { Project } from '../models/project.js';
import { Task } from '../models/task.js';
import { User } from '../models/User.js';
import Message from '../models/Message.js';


export const resolvers = {
    Query: {
        getProjects: async () => {
            const projects = await Project.find();
            return projects;
        },
        project: async (_, args) => {
            return await Project.findById(args.id)
        },
        getTasks: async () => {
            const tasks = await Task.find();
            return tasks;
        },
        getUsers: async () => {
            const users = await User.find();
            return users;
        },
        user: async (_, args) => {
            return await User.findById(args.id);
        },
        allUsers: async () => {
            return await User.find();
        },
        messagesBetween: async (_, { from, to }) => {
            return await Message.find({
                $or: [
                    { from, to },
                    { from: to, to: from }
                ]
            }).sort({ timestamp: 1 });
        },
        async messageHistory(_, { user1, user2 }) {
            return await Message.find({
                $or: [
                    { from: user1, to: user2 },
                    { from: user2, to: user1 }
                ]
            }).sort({ timestamp: 1 });
        }
    },
    
    Mutation:
    {
        addProject: async (_, args) => 
        {
            const project = {
                name: args.project.name,
                description: args.project.description,
                assignedStudents: args.project.assignedStudents,
                category: args.project.category,
                startDate: new Date(args.project.startDate),
                endDate: new Date(args.project.endDate),
            };
            return await Project.create(project); 
        },
        addTask: async (_, args) => {
            const task = {
                project: args.task.project, 
                name: args.task.name,
                description: args.task.description,
                assignedStudents: args.task.assignedStudents,
                status: args.task.status,
                dueDate: new Date(args.task.dueDate),
            };
            return await Task.create(task);
        },
        addUser: async (_, { username, password, isStudent, universityID }) => {
            const existing = await User.findOne({ username });
            if (existing) throw new Error('Username already exists');
            const user = new User({ username, password, isStudent, universityID });
            return await user.save();
            },

            login: async (_, { username, password }) => {
            const user = await User.findOne({ username, password });
            if (!user) throw new Error('Invalid credentials');
            return user;
        },
        updateTaskStatus: async (_, { id, status }) => {
            const task = await Task.findById(id);
            if (!task) throw new Error('Task not found');
            task.status = status;
            await task.save();
            return task;
        },
         deleteProject: async (_, { id }) => {
            const deleted = await Project.findByIdAndDelete(id);
            if (!deleted) throw new Error("Project not found");
            return deleted;
        },
        updateProjectStatus: async (_, { id, endDate }) => {
            const updated = await Project.findByIdAndUpdate(
                id,
                { endDate },
                { new: true }
            );
            if (!updated) throw new Error("Project not found");
            return updated;
        }
    }
    
}