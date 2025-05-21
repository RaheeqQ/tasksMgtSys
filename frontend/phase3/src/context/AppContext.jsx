import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [universityID, setUniversityID] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('Home');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const query = `
    mutation {
      addUser(username: "${username}", password: "${password}", isStudent: ${isStudent}, universityID: "${universityID}") {
        id
        username
        isStudent
        universityID
      }
    }
  `;
    const variables = {
      username: username,
      password,
      isStudent,
      universityID
    };

    try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    
    if (result.errors) {
      alert(result.errors[0].message);
    } else {
      const user = result.data.addUser;
      setCurrentUser(user);
      alert("Sign up successful!");
    }
  } catch (err) {
    console.error("Sign up error:", err);
    alert("Sign up failed.");
  }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

      const query = `
        mutation {
          login(username: "${inputUsername}", password: "${password}") {
            id
            username
            isStudent
            universityID
          }
        }
      `;

    try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (result.errors) {
      alert(result.errors[0].message);
    } else {
      const user = result.data.login;
      setCurrentUser(user);
      alert(`Welcome, ${user.isStudent ? "student" : "user"}!`);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed.");
  }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setCurrentPage('Home');
    setInputUsername('');
  };

  return (
    <AppContext.Provider
      value={{
        username, setUsername,
        password, setPassword,
        isStudent, setIsStudent,
        universityID, setUniversityID,
        inputUsername, setInputUsername,
        handleSignIn, handleSignUp,
        currentUser, setCurrentUser,
        handleSignOut,
        currentPage, setCurrentPage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
