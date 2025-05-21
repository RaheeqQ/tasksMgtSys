import { mongoose } from 'mongoose';

const uri = "mongodb+srv://s12112506:rQw1cVZUlzMyhoyS@cluster0.ay1q6xs.mongodb.net/TaskManager?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri).then(() => {
    console.log("MongoDB connected");
    }).catch((err) => {
        console.log("MongoDB connection error: ", err);
    });


