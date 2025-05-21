import React from 'react';

const Header = ({ onSignInClick, onSignUpClick, onSignOutClick, currentUser }) => {
    return (
        <header className="flex justify-end items-center bg-[#00033a] p-2 border-b-2 border-white w-full">
            <h3 className="text-white font-bold mr-2 leading-tight">
                {currentUser ? `Welcome, ${currentUser.username}` : 'Welcome'}
            </h3>
            {!currentUser ? (
                <>
                    <button onClick={onSignUpClick} className="bg-[#00033a] text-white px-3 py-1 border-2 border-white rounded-lg text-base mr-2 hover:bg-white hover:text-[#00033a] transition">
                        Sign Up
                    </button>
                    <button onClick={onSignInClick} className="bg-[#00033a] text-white px-3 py-1 border-2 border-white rounded-lg text-base mr-2 hover:bg-white hover:text-[#00033a] transition">
                        Sign In
                    </button>
                </>
            ) : (
                <button onClick={onSignOutClick} className="bg-[#00033a] text-white px-3 py-1 border-2 border-white rounded-lg text-base mr-2 hover:bg-white hover:text-[#00033a] transition">
                    Sign Out
                </button>
            )}
        </header>
    );
};

export default Header;
