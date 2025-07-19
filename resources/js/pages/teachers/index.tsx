import React from 'react';

const TeachersIndex = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Teacher</button>
      </div>
      <div className="bg-white shadow rounded p-4">
        {/* Teacher list will go here */}
        <p className="text-gray-500">No teachers found. (List will be implemented)</p>
      </div>
    </div>
  );
};

export default TeachersIndex;
