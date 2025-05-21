import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = ({ onNavigate }) => {
  const { currentUser } = useContext(AppContext);
  const isSignedIn = !!currentUser;

  return (
    <nav className="bg-[#00033a] w-1/5 border-r-2 border-white font-bold h-screen lg: w-5/5 md:w-1/5">
      <ul className="w-full h-full p-0">
        <li className="flex flex-col text-white text-[1.1rem]">
          <button
            className="bg-[#162647] text-white rounded-lg text-[1.1rem] border-none px-4 py-2 m-2 font-medium transition-colors duration-300 hover:bg-white hover:text-[#00033a]"
            onClick={() => onNavigate('Home')}
          >
            Home
          </button>
        </li>
        {["Dashboard", "Projects", "Tasks", "Chat"].map((item) => (
          <li key={item} className="flex flex-col text-white text-[1.1rem]">
            <button
              disabled={!isSignedIn}
              onClick={() => onNavigate(item)}
              className={`bg-[#162647] text-white rounded-lg text-[1.1rem] border-none px-4 py-2 m-2 font-medium transition-colors duration-300 ${
                isSignedIn
                  ? "hover:bg-white hover:text-[#00033a]"
                  : "disabled:bg-[#4e4e4e] disabled:text-[#00033a] disabled:cursor-not-allowed"
              }`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
