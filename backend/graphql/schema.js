export const typeDefs = `#graphql
    type Project {
    id: ID!
    name: String!
    description: String
    assignedStudents: [String!]
    category: String!
    startDate: String!
    endDate: String!
    }
    type Task {
    id: ID!
    project: String!
    name: String!
    description: String
    assignedStudents: [String!]
    status: String!
    dueDate: String!
    }
    type User {
        id: ID!
        username: String!
        password: String!
        isStudent: Boolean
        universityID: String
    }
    type Message {
        id: ID!
        from: String!
        to: String!
        message: String!
        timestamp: String!
    }
    type Query {
        getProjects: [Project]
        project(id: ID) : Project
        getTasks: [Task]
        getUsers: [User]
        user(id: ID): User
        allUsers: [User!]
        messagesBetween(from: String!, to: String!): [Message!]
        messageHistory(user1: String!, user2: String!): [Message!]!
    }
    type Mutation {
        addProject(project: ProjectInput): Project
        addTask(task: TaskInput): Task
        addUser(username: String!, password: String!, isStudent: Boolean, universityID: String): User
        login(username: String!, password: String!): User
        updateTaskStatus(id: ID!, status: String!): Task
        deleteProject(id: ID!): Project
        updateProjectStatus(id: ID!, endDate: String!): Project
    }
    input ProjectInput {
    name: String!
    description: String
    assignedStudents: [String!]
    category: String!
    startDate: String!
    endDate: String!
    }
    input TaskInput {
    project: String! 
    name: String!
    description: String
    assignedStudents: [String!]
    status: String!
    dueDate: String!
    }
`