import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const FloatingActionButton = () => {
  return (
    <button className="fixed bottom-16 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
      <AiOutlinePlus size={24} />
    </button>
  );
};

export default FloatingActionButton;
