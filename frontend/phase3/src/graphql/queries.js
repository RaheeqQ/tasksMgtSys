import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query getProjects {
    getProjects {
      id
      name
      description
      assignedStudents
      startDate
      endDate
      category
    }
  }
`;
export const GET_PROJECT = gql`
  query project($id: ID!) {
    project(id: $id) {
      id
      name
      description
      assignedStudents
      startDate
      endDate
      category
    }
  }
`;

export const GET_PROJECTS_NAMES = gql`
  query getProjectsNames {
    getProjects {
      id
      name
    }
  }
`;

export const GET_TASKS = gql`
  query getTasks {
    getTasks {
      id
      project
      name
      description
      assignedStudents
      status
      dueDate
    }
  }
`;

export const GET_USERS = gql`
  query getUsers {
    getUsers {
      id
      username
      password
      isStudent
      universityID
    }
  }
`;