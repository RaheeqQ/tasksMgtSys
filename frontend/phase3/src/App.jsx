// App.jsx
import { ApolloProvider } from "@apollo/client";
import client from "./services/client";
import React, { useState, useContext } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import './App.css';
import Navbar from './components/Navbar';
import Chat from './pages/Chat';
import { AuthProvider, AppContext } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

const AppContent = () => {
  const { currentUser, handleSignOut, currentPage, setCurrentPage } = useContext(AppContext);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const openSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const openSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const closeModals = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  let pageContent = null;
  if (currentPage === 'Home') {
    pageContent = (
      <Home
        showSignIn={showSignIn}
        showSignUp={showSignUp}
        closeModal={closeModals}
      />
    );
  } else if (currentPage === 'Dashboard') {
    pageContent = <Dashboard currentUser={currentUser}/>;
  } else if (currentPage === 'Chat') {
    pageContent = <Chat />;
  }else if (currentPage === 'Projects')
  {
    pageContent = <Projects currentUser={currentUser}/>;
  }else if (currentPage === 'Tasks')
  {
    pageContent = <Tasks currentUser={currentUser}/>;
  }

  return (
    <div className="w-full h-screen">
      <Header
        onSignInClick={openSignIn}
        onSignUpClick={openSignUp}
        onSignOutClick={handleSignOut}
        currentUser={currentUser}
      />
      <div className="flex bg-[#00033a] flex-col md:flex-row w-full h-screen">
        <Navbar onNavigate={setCurrentPage} />
        {pageContent}
      </div>
    </div>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
