import { mongoose } from 'mongoose';

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    description: {
        type: String
    },
    assignedStudents: [{
        type: String,
    }],
    category: {
        type: String,
        enum: ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning']
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);