import { mongoose } from 'mongoose';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    project: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    assignedStudents: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled']
    },
    dueDate: {
        type: Date
    },
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
