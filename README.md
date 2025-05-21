# Task Management System

## Overview
The Task Management System is a single-page web application (SPA) designed to help users efficiently manage tasks, track project progress, and facilitate communication. It supports collaboration between students and administrators, each with tailored functionalities. The application is built using modern web technologies, ensuring a responsive and user-friendly experience.

## Features
### User Roles
- **Administrators**:
  - Manage projects and tasks (add, delete, update).
  - View statistics on projects, students, and tasks.
  - Communicate with all users (students and admins).
- **Students**:
  - View assigned projects and tasks.
  - Track personal progress.
  - Communicate with administrators.
    
### Core Functionalities
- **Home**: Sign Up/Login.
![Image](https://github.com/user-attachments/assets/600070a1-d7ec-4ad1-8849-b1604f3c3c90)
- **Dashboard**: Displays key statistics (e.g., number of projects, tasks, completed projects) tailored to the user's role.
![Image](https://github.com/user-attachments/assets/86631e95-d25b-4f44-90ba-d72a366c957e)
- **Projects**:
  - Admins can add, delete, and update projects.
  - Students can view and filter their assigned projects.
![Image](https://github.com/user-attachments/assets/8f2332cb-d83c-4039-a5bb-d2969dcee425)
- **Tasks**:
  - Admins can add, update status, and filter tasks.
  - Students can view and filter their assigned tasks.
![Image](https://github.com/user-attachments/assets/b155e61b-8c39-49c0-967c-e72218b74ea9)
- **Chat**:
  - Real-time messaging with message history.
  - Admins can chat with all users; students can only chat with admins.
![Image](https://github.com/user-attachments/assets/980624f4-83ee-44be-b02e-334dcba726dc)

## Technologies Used
### Frontend
- **React**: For building the user interface.
- **Tailwind CSS**: For styling and responsiveness.

### Backend
- **Node.js**: Server-side logic.
- **MongoDB**: Database for storing users, projects, tasks, and messages.
- **GraphQL**: For efficient data querying and manipulation.
- **WebSocket**: Enables real-time chat functionality.

### Tools and Libraries
- **VS Code**: Primary development environment.
- **Apollo Server/Client**: For GraphQL integration.
- **Mongoose**: MongoDB object modeling.
- **React Router**: For navigation.
- **Chart.js**: For data visualization in the dashboard.
