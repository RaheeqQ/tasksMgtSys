import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Home = ({ showSignIn, showSignUp, closeModal }) => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    isStudent,
    setIsStudent,
    universityID,
    setUniversityID,
    inputUsername,
    setInputUsername,
    handleSignIn,
    handleSignUp,
  } = useContext(AppContext);
  return (
    <article className="flex flex-col items-center justify-center min-h-screen w-full bg-[#00033a] bg-[url('./images/img2.jpg')] bg-no-repeat bg-center bg-cover text-white px-4">
      {showSignIn && (
        <section className="bg-[#00033a] border-2 border-white rounded-lg p-6 w-11/12 max-w-md my-5">
          <h2 className="flex justify-between items-center text-xl font-bold mb-4">
            Sign In
            <span className="cursor-pointer text-white text-2xl hover:text-gray-300"onClick={closeModal}>×</span>
          </h2>
          <form onSubmit={handleSignIn}>
            <div className="flex flex-col font-bold mb-3">
              <label htmlFor="user-name-log">Username</label>
              <input type="text" id="user-name-log" required className="rounded-lg bg-white text-[#00033a] px-3 py-2 mt-1 text-base" value={inputUsername} onChange={(e) => setInputUsername(e.target.value)}/>
            </div>
            <div className="flex flex-col font-bold mb-3">
              <label htmlFor="password-log">Password</label>
              <input type="password" id="password-log" required className="rounded-lg bg-white text-[#00033a] px-3 py-2 mt-1 text-base" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Stay Signed in
              </label>
            </div>
            <input type="submit" value="Sign In" className="bg-[#d2ab17] hover:bg-[#a48612] text-white font-bold text-base py-2 px-4 rounded-lg w-full cursor-pointer"/>
          </form>
        </section>
      )}

      {showSignUp && (
        <section className="bg-[#00033a] border-2 border-white rounded-lg p-6 w-11/12 max-w-md">
          <h2 className="flex justify-between items-center text-xl font-bold mb-4">
            Sign Up
            <span className="cursor-pointer text-white text-2xl hover:text-gray-300" onClick={closeModal}>×</span>
          </h2>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col font-bold mb-3">
              <label htmlFor="user-name-reg">Username</label>
              <input type="text" id="user-name-reg" required className="rounded-lg bg-white text-[#00033a] px-3 py-2 mt-1 text-base" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="flex flex-col font-bold mb-3">
              <label htmlFor="password-reg">Password</label>
              <input type="password" id="password-reg" required className="rounded-lg bg-white text-[#00033a] px-3 py-2 mt-1 text-base" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)}/>
                I'm a student
              </label>
            </div>
            {isStudent && (
              <div className="flex flex-col font-bold mb-3">
                <label htmlFor="universityId">University ID</label>
                <input type="text" id="universityId" className="rounded-lg bg-white text-[#00033a] px-3 py-2 mt-1 text-base" value={universityID} onChange={(e) => setUniversityID(e.target.value)}/>
              </div>
            )}
            <input type="submit" value="Sign Up" className="bg-[#d2ab17] hover:bg-[#a48612] text-white font-bold text-base py-2 px-4 rounded-lg w-full cursor-pointer"/>
          </form>
        </section>
      )}
    </article>
  );
};

export default Home;