import React from 'react';
import { AiFillHome, AiOutlineSearch, AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';

const BottomNavBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around items-center p-2">
      <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <AiFillHome size={24} />
        <span className="text-xs">Home</span>
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <AiOutlineSearch size={24} />
        <span className="text-xs">Search</span>
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <AiOutlineCalendar size={24} />
        <span className="text-xs">Calendar</span>
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <AiOutlineUser size={24} />
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );
};

export default BottomNavBar;
